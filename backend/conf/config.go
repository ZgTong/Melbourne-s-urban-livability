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

package conf

import (
	"github.com/spf13/viper"
)

type Setting struct {
	vp *viper.Viper
}

func NewSetting() (*Setting, error) {
	vp := viper.New()
	vp.SetConfigName("config")
	vp.AddConfigPath("configs/")
	vp.SetConfigType("yaml")
	err := vp.ReadInConfig()
	if err != nil {
		return nil, err
	}

	return &Setting{vp}, nil
}

type DBSetting struct {
	DBAddress string
}

func (s *Setting) ReadSection(k string, v interface{}) error {
	err := s.vp.UnmarshalKey(k, v)
	if err != nil {
		return err
	}

	return nil
}
