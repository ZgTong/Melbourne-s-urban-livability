package service

import (
	"ccc/couchdb"
	"ccc/global"
	"ccc/internal/model"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"math"
	"net/http"
)

type SceneService struct {
}

func NewSportService() *SceneService {
	return &SceneService{}
}

func (h *SceneService) GetMetrics(ctx *gin.Context, r *model.SceneRequest) *model.SceneMetricsVO {
	DBAddress := global.DBSetting.DBAddress
	view := "_design/scene/_view/location"
	QueryString := couchdb.GetQueryString(DBAddress, r.Scene, view)
	log.Default().Printf(QueryString)
	resp, error := http.Get(QueryString)
	if error != nil {
		fmt.Printf(error.Error())
	}
	body, error := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	var sports model.SceneRowsDO
	err := json.Unmarshal(body, &sports)
	if err != nil {
		log.Default().Printf("error unmarshal json: %v", err.Error())
		return nil
	}
	sceneVOSlice := make([]*model.SceneVO, 0, len(sports.Rows))
	sceneBOMap := make(map[string]*model.SceneBO, 0)
	for _, row := range sports.Rows {
		location := row.Key[0]
		locationPid := row.Key[1]
		key := location + locationPid
		sceneBO, ok := sceneBOMap[key]
		if !ok {
			sceneBO = &model.SceneBO{
				Location:    location,
				LocationPid: locationPid,
			}
			sceneBOMap[key] = sceneBO
		}
		sentiment := row.Key[2]
		//保留两位小数
		row.Value = math.Floor(row.Value*100) / 100
		switch sentiment {
		case "neg":
			sceneBO.NegativeScore = row.Value
		case "neu":
			sceneBO.NeutralScore = row.Value
		case "pos":
			sceneBO.PositiveScore = row.Value
		}
	}
	var i = 0

	sceneBOSlice := make([]*model.SceneBO, 0, len(sports.Rows))
	for _, sceneBO := range sceneBOMap {
		if sceneBO.NegativeScore*sceneBO.NeutralScore*sceneBO.PositiveScore == 0 {
			continue
		}
		sceneBO := &model.SceneBO{
			Location: sceneBO.Location,
			//Id:            i,
			NegativeScore: sceneBO.NegativeScore,
			NeutralScore:  sceneBO.NeutralScore,
			PositiveScore: sceneBO.PositiveScore,
			LocationPid:   sceneBO.LocationPid,
		}
		i++
		//sceneBO.Scores = (4*sceneBO.PositiveScore + 2*sceneBO.NeutralScore - 4*sceneBO.NegativeScore) / 10
		totalScores := sceneBO.PositiveScore + sceneBO.NeutralScore + sceneBO.NegativeScore
		sceneBO.Scores = (sceneBO.PositiveScore + 1/2*sceneBO.NeutralScore) / totalScores
		//保留两位小数
		sceneBO.Scores = math.Floor(sceneBO.Scores*100) / 100
		sceneBOSlice = append(sceneBOSlice, sceneBO)
	}
	//sportsSceneVO := model.SceneMetricsVO{
	//	Metrics: sceneVOSlice,
	//}
	//return &sportsSceneVO

	//以上为按照地区聚合，接下来按照地区来进行聚合
	sceneBORegionMap := make(map[string][]*model.SceneBO, 0)
	for _, sceneBO := range sceneBOSlice {
		key := sceneBO.Location
		slice, _ := sceneBORegionMap[key]
		slice = append(slice, sceneBO)
		sceneBORegionMap[key] = slice
	}
	i = 0
	//得到了一张map，然后根据地区的key，来做聚合
	for location, boSlice := range sceneBORegionMap {
		sceneVO := &model.SceneVO{
			Id: i,
		}
		var totalNegativeScore, totalPositiveScore, totalNeutralScore, totalScores float64
		for j, bo := range boSlice {
			surSceneVO := &model.SceneVO{
				NegativeScore: bo.NegativeScore,
				PositiveScore: bo.PositiveScore,
				NeutralScore:  bo.NeutralScore,
				Id:            j,
				Location:      bo.LocationPid,
				//LocationPid   : bo.LocationPid,
				Scores: bo.Scores,
			}
			sceneVO.Suburbs = append(sceneVO.Suburbs, surSceneVO)
			totalNegativeScore += bo.NegativeScore
			totalNeutralScore += bo.NeutralScore
			totalPositiveScore += bo.PositiveScore
		}
		totalScores = totalNegativeScore + totalNeutralScore + totalPositiveScore
		sceneVO.NegativeScore = totalNegativeScore
		sceneVO.PositiveScore = totalPositiveScore
		sceneVO.NeutralScore = totalNeutralScore
		sceneVO.Scores = (totalPositiveScore + 1/2*totalNeutralScore) / totalScores
		sceneVO.Scores = math.Floor(sceneVO.Scores*100) / 100
		sceneVO.Location = location
		sceneVOSlice = append(sceneVOSlice, sceneVO)
		i++
	}
	names := make(map[string]interface{}, 0)
	for _, vo := range sceneVOSlice {
		names[vo.Location] = nil
	}
	for _, cityName := range global.CityConfig {
		value, ok := names[cityName]
		if cityName == "VIC193" {
			print("t")
			print(value)
		}
		if !ok {
			vo := &model.SceneVO{
				NegativeScore: 0,
				PositiveScore: 0,
				NeutralScore:  0,
				Id:            i,
				Location:      cityName,
				//LocationPid   : bo.LocationPid,
				Scores: 0,
			}
			i++
			sceneVOSlice = append(sceneVOSlice, vo)
		}
	}

	result := &model.SceneMetricsVO{
		//Metrics: sceneVOSlice,
		Metrics: sceneVOSlice,
	}

	return result
}
