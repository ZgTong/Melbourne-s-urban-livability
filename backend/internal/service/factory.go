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

package service

import "ccc/internal/service/demo"

/**
实现依赖注入的工厂类，配置相应service服务
*/
type Factory struct {
	HelloWorldService *demo.HelloWorldService
	SportService      *SceneService
	RegionService     *RegionService
}

func NewFactory() *Factory {
	return &Factory{
		HelloWorldService: demo.NewHelloWorldService(),
		SportService:      NewSportService(),
		RegionService:     NewRegionService(),
	}
}
