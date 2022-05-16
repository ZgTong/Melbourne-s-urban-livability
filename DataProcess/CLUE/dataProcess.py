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
cafes = pd.read_csv('Cafes_and_restaurants__with_seating_capacity.csv')
employs = pd.read_csv('Employment_by_block_by_CLUE_industry.csv')
carparks = pd.read_csv('Off-street_car_parks_with_capacity_and_type.csv')
dwellings = pd.read_csv('Residential_dwellings.csv')

print('bars')
bars['pid'] = bars.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
bars['vic_lga__3'] = bars.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

print('cafes')
cafes['pid'] = cafes.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
cafes['vic_lga__3'] = cafes.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

print('employ')
employs['pid'] = employs.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
employs['vic_lga__3'] = employs.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

print('carpark')
carparks['pid'] = carparks.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
carparks['vic_lga__3'] = carparks.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

print('dwelling')
dwellings['pid'] = dwellings.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
dwellings['vic_lga__3'] = dwellings.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)


bars_1 = bars.groupby(['Census year', 'pid', 'vic_lga__3'])['Number of patrons'].sum()
cafes_1 = cafes.groupby(['Census year', 'pid', 'vic_lga__3'])['Number of seats'].sum()
employs_1 = employs.groupby(['Census year', 'pid', 'vic_lga__3'])['Total employment in block'].sum()
carparks_1 = carparks.groupby(['Census year', 'pid', 'vic_lga__3'])['Parking spaces'].sum()
dwellings_1 = dwellings.groupby(['Census year', 'pid', 'vic_lga__3'])['Dwelling number'].sum()

bars_2 = bars_1.to_frame()
cafes_2 = cafes_1.to_frame()
employs_2 = employs_1.to_frame()
carparks_2 = carparks_1.to_frame()
dwellings_2 = dwellings_1.to_frame()

bars_3 = bars_2.reset_index()
cafes_3 = cafes_2.reset_index()
employs_3 = employs_2.reset_index()
carparks_3 = carparks_2.reset_index()
dwellings_3 = dwellings_2.reset_index()

print('bars2')
min_bars = bars_3['Number of patrons'].min()
max_bars = bars_3['Number of patrons'].max()
bars_3['scores'] = bars_3.apply(lambda x: 1 + (x['Number of patrons']-min_bars)/(max_bars-min_bars),axis=1)

print('cafes2')
min_cafes = cafes_3['Number of seats'].min()
max_cafes = cafes_3['Number of seats'].max()
cafes_3['scores'] = cafes_3.apply(lambda x: 1 + (x['Number of seats']-min_cafes)/(max_cafes-min_cafes),axis=1)

print('employ2')
min_employs = employs_3['Total employment in block'].min()
max_employs = employs_3['Total employment in block'].max()
employs_3['scores'] = employs_3.apply(lambda x: 1 + (x['Total employment in block']-min_employs)/(max_employs-min_employs),axis=1)

print('carpark2')
min_carparks = carparks_3['Parking spaces'].min()
max_carparks = carparks_3['Parking spaces'].max()
carparks_3['scores'] = carparks_3.apply(lambda x: 1 + (x['Parking spaces']-min_carparks)/(max_carparks-min_carparks),axis=1)

print('dwelling2')
min_dwellings = dwellings_3['Dwelling number'].min()
max_dwellings = dwellings_3['Dwelling number'].max()
dwellings_3['scores'] = dwellings_3.apply(lambda x: 1 + (x['Dwelling number']-min_dwellings)/(max_dwellings-min_dwellings),axis=1)


bars_3.to_excel('barsandpubs.xlsx',index = False)
cafes_3.to_excel('cafe&restaurants.xlsx',index = False)
employs_3.to_excel('employs.xlsx',index = False)
carparks_3.to_excel('carparks.xlsx',index = False)
dwellings_3.to_excel('dwellings.xlsx',index = False)

bars_js = bars_3.to_json()
cafes_js = cafes_3.to_json()
employs_js = employs_3.to_json()
carparks_js = carparks_3.to_json()
dwellings_js = dwellings_3.to_json()

bars_json = open('bars_json.json', 'w')
bars_json.write(bars_js)
bars_json.close()

cafes_json = open('cafes_json.json', 'w')
cafes_json.write(cafes_js)
cafes_json.close()

employs_json = open('employs_json.json', 'w')
employs_json.write(employs_js)
employs_json.close()

carparks_json = open('carparks_json.json', 'w')
carparks_json.write(carparks_js)
carparks_json.close()

dwellings_json = open('dwellings_json.json', 'w')
dwellings_json.write(dwellings_js)
dwellings_json.close()
