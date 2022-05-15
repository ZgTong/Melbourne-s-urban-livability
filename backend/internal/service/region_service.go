package service

import (
	"ccc/couchdb"
	"ccc/global"
	"ccc/internal/model"
	"fmt"
	"log"
	"math"
)

type RegionService struct {
}

func NewRegionService() *RegionService {
	return &RegionService{}
}

func (r *RegionService) GetWeatherLineData() interface{} {
	dBAddress := global.DBSetting.DBAddress
	view := "_design/weather/_view/uv_max"
	uvQueryString := couchdb.GetQueryString(dBAddress, "pastweather", view)
	log.Default().Printf(uvQueryString)
	uvRowsDO := couchdb.GetRowsData(uvQueryString)
	uvMetrics := make([]*model.WeatherMetricVO, 0, 1)
	for _, row := range uvRowsDO.Rows {
		var value float64
		if row.Value.Count > 0 {
			value = row.Value.Sum / row.Value.Count
		}
		value = math.Round(value*100) / 100
		year := row.Key[0]
		month := row.Key[1]
		metricVO := &model.WeatherMetricVO{
			Year:   year,
			Month:  month,
			Metric: value,
		}
		uvMetrics = append(uvMetrics, metricVO)
	}
	view = "_design/weather/_view/temperature_avg"
	tempQueryString := couchdb.GetQueryString(dBAddress, "pastweather", view)
	log.Default().Printf(uvQueryString)
	tempRowsDO := couchdb.GetRowsData(tempQueryString)
	tempMetrics := make([]*model.WeatherMetricVO, 0, 1)
	for _, row := range tempRowsDO.Rows {
		var value float64
		if row.Value.Count > 0 {
			value = row.Value.Sum / row.Value.Count
		}
		value = math.Round(value*100) / 100
		year := row.Key[0]
		month := row.Key[1]
		metricVO := &model.WeatherMetricVO{
			Year:   year,
			Month:  month,
			Metric: value,
		}
		tempMetrics = append(tempMetrics, metricVO)
	}
	view = "_design/weather/_view/humidity_avg"
	humidQueryString := couchdb.GetQueryString(dBAddress, "pastweather", view)
	log.Default().Printf(humidQueryString)
	humidRowsDO := couchdb.GetRowsData(humidQueryString)
	humidMetrics := make([]*model.WeatherMetricVO, 0, 1)
	for _, row := range humidRowsDO.Rows {
		var value float64
		if row.Value.Count > 0 {
			value = row.Value.Sum / row.Value.Count
		}
		value = math.Round(value*100) / 100
		year := row.Key[0]
		month := row.Key[1]
		metricVO := &model.WeatherMetricVO{
			Year:   year,
			Month:  month,
			Metric: value,
		}
		humidMetrics = append(humidMetrics, metricVO)
	}
	view = "_design/weather/_view/wind_avg"
	windQueryString := couchdb.GetQueryString(dBAddress, "pastweather", view)
	log.Default().Printf(windQueryString)
	windRowsDO := couchdb.GetRowsData(windQueryString)
	windMetrics := make([]*model.WeatherMetricVO, 0, 1)
	for _, row := range windRowsDO.Rows {
		var value float64
		if row.Value.Count > 0 {
			value = row.Value.Sum / row.Value.Count
		}
		value = math.Round(value*100) / 100
		year := row.Key[0]
		month := row.Key[1]
		metricVO := &model.WeatherMetricVO{
			Year:   year,
			Month:  month,
			Metric: value,
		}
		windMetrics = append(windMetrics, metricVO)
	}
	result := &model.WeathersVO{
		UVMetrics:    uvMetrics,
		TempMetrics:  tempMetrics,
		HumidMetrics: humidMetrics,
		WindMetrics:  windMetrics,
	}
	return result
}

func (r *RegionService) GetLineData(db string) interface{} {
	dBAddress := global.DBSetting.DBAddress
	view := fmt.Sprintf("_design/%s/_view/linedata", db)
	sportsString := couchdb.GetQueryString(dBAddress, db, view)
	log.Default().Printf(sportsString)
	sportsRowsDO := couchdb.GetSceneRowsData(sportsString)
	metrics := make([]*model.MetricVO, 0, 1)
	for _, row := range sportsRowsDO.Rows {
		var value float64
		value = row.Value
		value = math.Round(value*100) / 100
		year := row.Key[0]
		vo := &model.MetricVO{
			Year:   year,
			Metric: value,
		}
		metrics = append(metrics, vo)
	}
	return metrics
}

func (r *RegionService) GetSports(locationPid string) interface{} {
	dBAddress := global.DBSetting.DBAddress
	view := "_design/sports/_view/data"
	sportsQueryString := couchdb.GetQueryString(dBAddress, "sports_played", view)
	log.Default().Printf(sportsQueryString)
	regionRowsDO := couchdb.GetRowsData(sportsQueryString)
	resultSlice := make([]*model.SportsVO, 0, 1)
	for _, row := range regionRowsDO.Rows {
		value := row.Value
		location := row.Key[0]
		vo := &model.SportsVO{
			SportsNumber: value.Max,
			LocationPid:  location,
		}
		resultSlice = append(resultSlice, vo)
	}
	if locationPid != "" {
		filterResultSlice := make([]*model.SportsVO, 0)
		for _, vo := range resultSlice {
			if vo.LocationPid == locationPid {
				filterResultSlice = append(filterResultSlice, vo)
			}
		}
		return filterResultSlice
	}

	return resultSlice
}

func (r *RegionService) GetFoods(locationPid string) interface{} {
	dBAddress := global.DBSetting.DBAddress
	view := "_design/bars/_view/data"
	barQueryString := couchdb.GetQueryString(dBAddress, "aurin-bars", view)
	log.Default().Printf(barQueryString)
	regionRowsDO := couchdb.GetRowsData(barQueryString)
	resultMap := make(map[string]*model.FoodsVO, 0)
	for _, row := range regionRowsDO.Rows {
		value := row.Value
		location := row.Key[0]
		vo := &model.FoodsVO{
			BarsScore:   value.Max,
			LocationPid: location,
		}
		resultMap[location] = vo
	}
	view = "_design/cafes/_view/data"
	cafeQueryString := couchdb.GetQueryString(dBAddress, "aurin-cafes", view)
	log.Default().Printf(cafeQueryString)
	regionRowsDOV2 := couchdb.GetRowsData(cafeQueryString)
	for _, row := range regionRowsDOV2.Rows {
		value := row.Value
		location := row.Key[0]
		vo, ok := resultMap[location]
		if !ok {
			vo = &model.FoodsVO{
				CafesScore:  value.Max,
				LocationPid: location,
			}
			resultMap[location] = vo
		} else {
			vo.CafesScore = value.Max
		}
	}
	resultSlice := make([]*model.FoodsVO, 0)
	for _, vo := range resultMap {
		if vo.BarsScore*vo.CafesScore != 0 {
			vo.Ratio = vo.BarsScore / vo.CafesScore
		} else {
			vo.Ratio = 0
		}
		resultSlice = append(resultSlice, vo)
	}

	if locationPid != "" {
		filterResultSlice := make([]*model.FoodsVO, 0)
		for _, vo := range resultSlice {
			if vo.LocationPid == locationPid {
				filterResultSlice = append(filterResultSlice, vo)
			}
		}
		return filterResultSlice
	}
	return resultSlice
}
