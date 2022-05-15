package main

import (
	"ccc/conf"
	"ccc/global"
	handler "ccc/internal/http/handlers"
	"ccc/internal/http/middleware"
	"ccc/internal/http/routers"
	"ccc/internal/service"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"time"
)

func setupSetting() error {
	setting, err := conf.NewSetting()
	if err != nil {
		return err
	}
	err = setting.ReadSection("DB", &global.DBSetting)
	if err != nil {
		return err
	}
	return nil
}

func initGin() *gin.Engine {
	global.CityConfig = ReadCityConfig()
	err := setupSetting()
	for err != nil {
		log.Fatalf("init.setupSetting err: %v", err)
	}
	server := gin.New()
	server.Use(gin.Logger())
	server.Use(gin.Recovery())
	server.Use(middleware.Cors())
	factory := service.NewFactory()
	v1Api := routers.NewAPI(handler.NewHelloWorldHandler(factory), handler.NewSceneHandler(factory), handler.NewRegionHandler(factory))
	v1Api.RegisterRouter(server)
	return server
}

func ReadCityConfig() []string {
	var cityDO global.CityDO
	filePtr, err := os.Open("./conf/city_name.json")
	if err != nil {
		log.Default().Printf("can't read city_name.json")
	}
	defer filePtr.Close()
	decoder := json.NewDecoder(filePtr)
	err = decoder.Decode(&cityDO)
	if err != nil {
		log.Default().Printf("can't decode city_name.json")
	}
	return cityDO.City
}

func main() {
	server := initGin()
	s := &http.Server{
		Addr:           ":8080",
		Handler:        server,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	s.ListenAndServe()
}
