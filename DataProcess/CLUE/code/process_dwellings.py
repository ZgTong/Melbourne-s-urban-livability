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


dwellings = pd.read_csv('Residential_dwellings.csv')

print('dwelling')
dwellings['pid'] = dwellings.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
dwellings['vic_lga__3'] = dwellings.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

dwellings_1 = dwellings.groupby(['Census year', 'pid', 'vic_lga__3'])['Dwelling number'].sum()
dwellings_2 = dwellings_1.to_frame()
dwellings_3 = dwellings_2.reset_index()

print('dwelling2')
min_dwellings = dwellings_3['Dwelling number'].min()
max_dwellings = dwellings_3['Dwelling number'].max()
dwellings_3['scores'] = dwellings_3.apply(lambda x: 1 + (x['Dwelling number']-min_dwellings)/(max_dwellings-min_dwellings),axis=1)

dwellings_3.to_excel('dwellings.xlsx',index = False)

dwellings_js = dwellings_3.to_json()

dwellings_json = open('dwellings_json.json', 'w')
dwellings_json.write(dwellings_js)
dwellings_json.close()