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
