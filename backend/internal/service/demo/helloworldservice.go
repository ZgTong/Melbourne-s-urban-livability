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
