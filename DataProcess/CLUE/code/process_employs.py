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


employs = pd.read_csv('Employment_by_block_by_CLUE_industry.csv')

print('employ')
employs['pid'] = employs.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
employs['vic_lga__3'] = employs.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

# for i in range(len(employs)):
#     employs['pid'][i] = get_lga_pid(employs['x coordinate'][i],employs['y coordinate'][i])
#     employs['vic_lga__3'][i] = get_lga_lga3(employs['x coordinate'][i],employs['y coordinate'][i])

employs_1 = employs.groupby(['Census year', 'pid', 'vic_lga__3'])['Total employment in block'].sum()
employs_2 = employs_1.to_frame()
employs_3 = employs_2.reset_index()

print('employ2')
min_employs = employs_3['Total employment in block'].min()
max_employs = employs_3['Total employment in block'].max()
employs_3['scores'] = employs_3.apply(lambda x: 1 + (x['Total employment in block']-min_employs)/(max_employs-min_employs),axis=1)

employs_3.to_excel('employs.xlsx',index = False)

employs_js = employs_3.to_json()

employs_json = open('employs_json.json', 'w')
employs_json.write(employs_js)
employs_json.close()
