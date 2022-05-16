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


package model

type RegionRowsDO struct {
	Rows []*RegionDO `json:"rows"`
}

type RegionDO struct {
	Key   []string `json:"key"`
	Value Value    `json:"value"`
}

type Value struct {
	Sum    float64 `json:"sum"`
	Count  float64 `json:"count"`
	Min    float64 `json:"min"`
	Max    float64 `json:"max"`
	SumSQR float64 `json:"sum_sqr"`
}

type SportsVO struct {
	SportsNumber float64 `json:"sportsNumber"`
	LocationPid  string  `json:"locationPid"`
}

type FoodsVO struct {
	BarsScore   float64 `json:"barsScore"`
	CafesScore  float64 `json:"cafesScore""`
	Ratio       float64 `json:"ratio"`
	LocationPid string  `json:"locationPid"`
}

type WeathersVO struct {
	UVMetrics    []*WeatherMetricVO `json:"UVmetrics"`
	TempMetrics  []*WeatherMetricVO `json:"Tempmetrics"`
	WindMetrics  []*WeatherMetricVO `json:"WindMetrics"`
	HumidMetrics []*WeatherMetricVO `json:"HumidMetrics"`
}

type WeatherMetricVO struct {
	Year   string  `json:"year"`
	Month  string  `json:"month"`
	Metric float64 `json:"metric"`
}

type MetricVO struct {
	Year   string  `json:"year"`
	Metric float64 `json:metric`
}
