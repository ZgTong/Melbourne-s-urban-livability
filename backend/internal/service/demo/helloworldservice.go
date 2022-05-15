package demo

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-kivik/kivik/v3"
)

type IHelloWorldService interface {
	HelloWorld(s string)
}

type HelloWorldService struct {
	db *kivik.DB
}

func NewHelloWorldService() *HelloWorldService {
	return &HelloWorldService{}
}

func (h *HelloWorldService) HelloWorld(ctx *gin.Context, s string) string {
	r := fmt.Sprintf("This is a HelloWolrd %s", s)
	return r
}
