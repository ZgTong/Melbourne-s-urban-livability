package handler

import (
	"ccc/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

//依赖注入
type RegionHandler struct {
	sFactory *service.Factory
}

func NewRegionHandler(factory *service.Factory) *RegionHandler {
	return &RegionHandler{
		sFactory: factory,
	}
}

func (h *RegionHandler) RegisterRoutes(group *gin.RouterGroup) {
	group.GET("weather", h.getWeatherLineData)
	group.GET("sports", h.getSportsData)
	group.GET("foods", h.getFoodsData)
	group.GET("LineData", h.getLineData)
}

func (h *RegionHandler) getWeatherLineData(c *gin.Context) {
	r := h.sFactory.RegionService
	result := r.GetWeatherLineData()
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *RegionHandler) getLineData(c *gin.Context) {
	topic := c.Query("topic")
	r := h.sFactory.RegionService
	result := r.GetLineData(topic)
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *RegionHandler) getSportsData(c *gin.Context) {
	r := h.sFactory.RegionService
	location := c.Query("location")
	result := r.GetSports(location)
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *RegionHandler) getFoodsData(c *gin.Context) {
	r := h.sFactory.RegionService
	location := c.Query("location")
	result := r.GetFoods(location)
	c.JSON(http.StatusOK, gin.H{"data": result})
}
