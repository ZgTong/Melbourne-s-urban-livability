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
	"ccc/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

//依赖注入
type HelloWorldHandler struct {
	sFactory *service.Factory
}

func NewHelloWorldHandler(factory *service.Factory) *HelloWorldHandler {
	return &HelloWorldHandler{
		sFactory: factory,
	}
}

func (h *HelloWorldHandler) RegisterRoutes(group *gin.RouterGroup) {
	group.GET("HelloWorld", h.HelloWorld)
}

func (h *HelloWorldHandler) HelloWorld(c *gin.Context) {
	s := h.sFactory.HelloWorldService
	result := s.HelloWorld(c, "test")
	c.JSON(http.StatusOK, gin.H{"message": result})
}
