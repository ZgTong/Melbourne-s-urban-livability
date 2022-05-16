// Part of Assignment 2 - COMP90024 Cluster and Cloud Computing 2022 S1
//
// Team 28
// 
// Authors: 
//
//  * Yuanzhi Shang (Student ID: 1300135)
//  * Zuguang Tong (Student ID: 1273868)
//  * Ruoyi Gan (Student ID: 987838)
//  * Zixuan Guo (Student ID: 1298930)
//  * Jingyu Tan (Student ID: 1184788)
//
// Location: Melbourne
//

package handler

import (
	"ccc/internal/model"
	"ccc/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

//依赖注入
type SceneHandler struct {
	sFactory *service.Factory
}

func NewSceneHandler(factory *service.Factory) *SceneHandler {
	return &SceneHandler{
		sFactory: factory,
	}
}

func (s *SceneHandler) RegisterRoutes(group *gin.RouterGroup) {
	group.GET("scene", s.getScene)
}

func (h *SceneHandler) getScene(c *gin.Context) {
	s := h.sFactory.SportService
	var request model.SceneRequest
	request.Scene = c.Query("topic")
	//if c.Query("year") != "" {
	//	year, err := strconv.Atoi(c.Query("year"))
	//	if err != nil {
	//		log.Default().Printf("Error Request %v", err.Error())
	//		c.JSON(http.StatusBadRequest, gin.H{"data": "Error Request Wrong Value Type"})
	//		return
	//	}
	//	//request.Year = year
	//}
	result := s.GetMetrics(c, &request)
	c.JSON(http.StatusOK, gin.H{"data": result})
}
