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

from shapely.geometry import shape, Point
import numpy as np
import pandas as pd
import json

with open('suburb_geo.json') as f:
    geo_info = json.load(f)

def get_lga_pid(x_coor, y_coor):
    point = Point(x_coor, y_coor)
    for feature in geo_info['features']:
        bound = shape(feature['geometry'])
        if bound.contains(point):
            return feature['properties']["loc_pid"]
    return None


def get_lga_lga3(x_coor, y_coor):
    point = Point(x_coor, y_coor)
    for feature in geo_info['features']:
        bound = shape(feature['geometry'])
        if bound.contains(point):
            return feature['properties']['vic_loca_2']
    return None


bars = pd.read_csv('Bars_and_pubs__with_patron_capacity.csv')

print('bars')
bars['pid'] = bars.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
bars['vic_lga__3'] = bars.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

bars_1 = bars.groupby(['Census year', 'pid', 'vic_lga__3'])['Number of patrons'].sum()
bars_2 = bars_1.to_frame()
bars_3 = bars_2.reset_index()

print('bars2')
min_bars = bars_3['Number of patrons'].min()
max_bars = bars_3['Number of patrons'].max()
bars_3['scores'] = bars_3.apply(lambda x: round(1 + (x['Number of patrons']-min_bars)/(max_bars-min_bars), 4),axis=1)

bars_3.to_excel('barsandpubs.xlsx',index = False)
bars_js = bars_3.to_json()

bars_json = open('bars_json.json', 'w')
bars_json.write(bars_js)
bars_json.close()
