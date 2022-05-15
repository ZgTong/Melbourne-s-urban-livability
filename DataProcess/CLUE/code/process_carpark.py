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


carparks = pd.read_csv('Off-street_car_parks_with_capacity_and_type.csv')

print('carpark')
carparks['pid'] = carparks.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
carparks['vic_lga__3'] = carparks.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

carparks_1 = carparks.groupby(['Census year', 'pid', 'vic_lga__3'])['Parking spaces'].sum()
carparks_2 = carparks_1.to_frame()
carparks_3 = carparks_2.reset_index()

print('carpark2')
min_carparks = carparks_3['Parking spaces'].min()
max_carparks = carparks_3['Parking spaces'].max()
carparks_3['scores'] = carparks_3.apply(lambda x: 1 + (x['Parking spaces']-min_carparks)/(max_carparks-min_carparks),axis=1)

carparks_3.to_excel('carparks.xlsx',index = False)

carparks_js = carparks_3.to_json()

carparks_json = open('carparks_json.json', 'w')
carparks_json.write(carparks_js)
carparks_json.close()