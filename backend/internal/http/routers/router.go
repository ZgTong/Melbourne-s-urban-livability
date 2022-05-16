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
package routers

import (
	handler "ccc/internal/http/handlers"
	"github.com/gin-gonic/gin"
)

const (
	ForwardRootPathV1 = "/api/v1"
)

// API
type API struct {
	handlerList []handler.BaseHandler
}

// 这里创建相应的handler
func NewAPI(handlerList ...handler.BaseHandler) *API {
	return &API{handlerList: handlerList}
}

// RegisterRouter register v1 api router
func (a *API) RegisterRouter(engine *gin.Engine) {
	// YunAPI global router.

	router := engine.Group(ForwardRootPathV1)

	//注册相应路由
	for _, handlerItem := range a.handlerList {
		handlerItem.RegisterRoutes(router)
	}
}
