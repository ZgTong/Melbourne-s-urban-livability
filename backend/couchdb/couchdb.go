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

package couchdb

import (
	"ccc/internal/model"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type Couchdb struct {
}

func GetQueryString(dbAddress string, dbName string, view string) string {
	q := fmt.Sprintf("%s/%s/%s?group=true", dbAddress, dbName, view)
	return q
}

func GetRowsData(queryString string) *model.RegionRowsDO {
	resp, error := http.Get(queryString)
	if error != nil {
		fmt.Printf(error.Error())
	}
	body, error := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	var regionRowsDO *model.RegionRowsDO
	error = json.Unmarshal(body, &regionRowsDO)
	if error != nil {
		log.Default().Printf("error unmarshal json: %v", error.Error())
		return nil
	}
	return regionRowsDO
}

func GetSceneRowsData(queryString string) *model.SceneRowsDO {
	resp, error := http.Get(queryString)
	if error != nil {
		fmt.Printf(error.Error())
	}
	body, error := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	var regionRowsDO *model.SceneRowsDO
	error = json.Unmarshal(body, &regionRowsDO)
	if error != nil {
		log.Default().Printf("error unmarshal json: %v", error.Error())
		return nil
	}
	return regionRowsDO
}
