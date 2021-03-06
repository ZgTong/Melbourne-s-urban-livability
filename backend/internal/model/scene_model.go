
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

type SceneRowsDO struct {
	Rows []*SceneDO `json:"rows"`
}

type SceneDO struct {
	Key   []string `json:"key"`
	Value float64  `json:"value"`
}

type SceneMetricsVO struct {
	Metrics []*SceneVO
}

type SceneVO struct {
	NegativeScore float64 `json:"negativeMetric"`
	PositiveScore float64 `json:"positiveMetric"`
	NeutralScore  float64 `json:"neutralMetric"`
	Id            int     `json:"id"`
	Location      string  `json:"location"`
	//LocationPid   string  `json:"locationPid"`
	Scores  float64    `json:"totalMetrics"`
	Suburbs []*SceneVO `json:"suburbs,omitempty"`
}

type SceneBO struct {
	NegativeScore float64    `json:"negativeMetric"`
	PositiveScore float64    `json:"positiveMetric"`
	NeutralScore  float64    `json:"neutralMetric"`
	Location      string     `json:"location"`
	LocationPid   string     `json:"locationPid"`
	Scores        float64    `json:"totalMetrics"`
	Suburbs       []*SceneBO `json:"suburbs,omitempty"`
}

type SceneRequest struct {
	Scene string `json:"topic"`
}
