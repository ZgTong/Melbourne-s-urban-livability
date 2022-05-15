package global

import "ccc/conf"

var (
	DBSetting  *conf.DBSetting
	CityConfig []string
)

type CityDO struct {
	City []string `json:"city"`
}
