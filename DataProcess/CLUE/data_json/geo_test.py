# Part of Assignment 2 - COMP90024 Cluster and Cloud Computing 2022 S1
#
# Team 28
# 
# Authors: 
#
#  * Yuanzhi Shang (Student ID: 1300135)
#  * Zuguang Tong (Student ID: 1273868)
#  * Ruoyi Gan (Student ID: 987838)
#  * Zixuan Guo (Student ID: 1298930)
#  * Jingyu Tan (Student ID: 1184788)
#
# Location: Melbourne
#

from shapely.geometry import Point, shape

import json

new_result = []

    
with open('suburb_geo.json') as fp1:
    geo_info = json.load(fp1)
    
with open('vic_sport_and_recreation_2015-158913091085882945.json') as f:
    tweets = json.load(f)
    
a=0
for tweet in tweets['features']:
    point = Point(tweet["geometry"]['coordinates'][0], tweet["geometry"]['coordinates'][1])
    for feature in geo_info['features']:
        bound = shape(feature['geometry'])
        
        if bound.contains(point):
            tweet["pid"] = feature["properties"]["loc_pid"]
            tweet["vic_lga__3"] = feature["properties"]["vic_loca_2"]
            
                
    new_result.append(tweet)
    print(tweet)
    print(point)
    a=a+1
    print(a)


with open('sports_after_json.json', 'w') as file:
    json.dump(new_result, file, indent=2)
