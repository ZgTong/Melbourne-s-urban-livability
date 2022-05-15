package handler

import "github.com/gin-gonic/gin"

// BaseHandler interface
type BaseHandler interface {

	// RegisterRouter
	RegisterRoutes(group *gin.RouterGroup)
}
