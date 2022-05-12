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

cafes = pd.read_csv('Cafes_and_restaurants__with_seating_capacity.csv')

print('cafes')
cafes['pid'] = cafes.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
cafes['vic_lga__3'] = cafes.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)


cafes_1 = cafes.groupby(['Census year', 'pid', 'vic_lga__3'])['Number of seats'].sum()
cafes_2 = cafes_1.to_frame()
cafes_3 = cafes_2.reset_index()


print('cafes2')
min_cafes = cafes_3['Number of seats'].min()
max_cafes = cafes_3['Number of seats'].max()
cafes_3['scores'] = cafes_3.apply(lambda x: 1 + (x['Number of seats']-min_cafes)/(max_cafes-min_cafes),axis=1)

cafes_3.to_excel('cafe&restaurants.xlsx',index = False)

cafes_js = cafes_3.to_json()

cafes_json = open('cafes_json.json', 'w')
cafes_json.write(cafes_js)
cafes_json.close()