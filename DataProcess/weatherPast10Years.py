import json
import numpy as np
import pandas as pd
import requests
import time
import datetime


url = 'https://weather-api.science.unimelb.edu.au/past-10-year-weather'
print(url)
wea_city = pd.DataFrame()
response = requests.get(url)
x = response.json()

try:
    xx = pd.DataFrame(x)
    wea_city = pd.concat([wea_city,xx])
    print('解析成功————————————————————————————————\n')
except:
    print('解析失败\n')


wea_city = wea_city.reset_index()
del wea_city['index']

def change_d(the_time):
    now = int(the_time)/1000
    timeArray = time.localtime(now)
    otherStyleTime = time.strftime("%Y-%m-%d", timeArray)
    return otherStyleTime

wea_city['date'] = wea_city['temperature_min'].apply(lambda x: x[0])
wea_city['temperature_min'] = wea_city['temperature_min'].apply(lambda x: x[1])
wea_city['date'] = wea_city['date'].apply(lambda x: change_d(int(x)))
wea_city['temperature_avg'] = wea_city['temperature_avg'].apply(lambda x: round(float(x[1]), 2))
wea_city['temperature_max'] = wea_city['temperature_max'].apply(lambda x: x[1])
wea_city['uv_max'] = wea_city['uv_max'].apply(lambda x: x[1])
wea_city['rain_sum'] = wea_city['rain_sum'].apply(lambda x: x[1])
wea_city['humidity_avg'] = wea_city['humidity_avg'].apply(lambda x: round(float(x[1]), 2))
wea_city['wind_max'] = wea_city['wind_max'].apply(lambda x: x[1])
wea_city['wind_avg'] = wea_city['wind_avg'].apply(lambda x: round(float(x[1]), 2))

order = ['date', 'temperature_min', 'temperature_avg', 'temperature_max', 'uv_max', 'rain_sum', 'humidity_avg', 'wind_max', 'wind_avg']
wea_city = wea_city[order]

print(wea_city)

wea_city.to_excel('weather_past10years.xlsx',index = False)