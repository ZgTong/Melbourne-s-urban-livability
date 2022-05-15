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
