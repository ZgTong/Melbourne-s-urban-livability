from shapely.geometry import shape, Point
import numpy as np
import pandas as pd
import json

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

bars['pid'] = bars.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
bars['vic_lga__3'] = bars.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)
bars_1 = bars.groupby(['Census year', 'pid', 'vic_lga__3'])['Number of patrons'].sum()
bars_2 = bars_1.to_frame()
bars_3 = bars_2.reset_index()
print(bars_3.columns)
print(bars_3)
# bars_3.to_excel('barsandpubs.xlsx',index = False)
# bars4 = pd.read_csv('barsandpubs.csv')
# bars4['scores'] = bars4.apply(lambda x: 1 + (x['Number of patrons']-x['Number of patrons'].min())/(x['Number of patrons'].max()-x['Number of patrons'].min()),axis=1)
min_bars = bars_3['Number of patrons'].min()
max_bars = bars_3['Number of patrons'].max()
bars_3['scores'] = bars_3.apply(lambda x: 1 + (x['Number of patrons']-min_bars)/(max_bars-min_bars),axis=1)
print(bars_3)
# bars = pd.read_csv('Bars_and_pubs__with_patron_capacity.csv')
# cafes = pd.read_csv('Cafes_and_restaurants__with_seating_capacity.csv')

# bars['pid'] = 0
# bars['vic_lga__3'] = 0
# for i in range(len(bars)):
#     bars['pid'][i], bars['vic_lga__3'][i] = get_lga(bars['x coordinate'][i], bars['y coordinate'][i])
# cafes['vic_lga__3'] = 0
# print('--------------cafes----------')
# for i in range(len(cafes)):
#     cafes['pid'][i], cafes['vic_lga__3'][i] = get_lga(cafes['x coordinate'][i], cafes['y coordinate'][i])

# cafes['pid'] = cafes['pid'].apply(lambda x: get_lga_pid(cafes['x coordinate'], cafes['y coordinate']))

# cafes['pid'] = cafes.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)


# print(cafes.head())

# # bars['pid'] = 0
# # bars['vic_lga__3'] = 0
# # for i in range(len(bars)):
# #     bars['pid'][i], bars['vic_lga__3'][i] = get_lga(bars['x coordinate'][i], bars['y coordinate'][i])
# print('bars1')
# bars['pid'] = bars.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
# bars['vic_lga__3'] = bars.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

# # cafes['pid'] = 0
# # cafes['vic_lga__3'] = 0
# # for i in range(len(cafes)):
# #     cafes['pid'][i], cafes['vic_lga__3'][i] = get_lga(cafes['x coordinate'][i], cafes['y coordinate'][i])
# print('cafes1')
# cafes['pid'] = cafes.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
# cafes['vic_lga__3'] = cafes.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

# # employs['pid'] = 0
# # employs['vic_lga__3'] = 0
# # for i in range(len(employs)):
# #     employs['pid'][i], employs['vic_lga__3'][i] = get_lga(employs['x coordinate'][i], employs['y coordinate'][i])
# print('employs1')
# employs['pid'] = employs.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
# employs['vic_lga__3'] = employs.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

# # carparks['pid'] = 0
# # carparks['vic_lga__3'] = 0
# # for i in range(len(carparks)):
# #     carparks['pid'][i], carparks['vic_lga__3'][i] = get_lga(carparks['x coordinate'][i], carparks['y coordinate'][i])
# print('carparks1')
# carparks['pid'] = carparks.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
# carparks['vic_lga__3'] = carparks.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)

# # dwellings['pid'] = 0
# # dwellings['vic_lga__3'] = 0
# # for i in range(len(dwellings)):
# #     dwellings['pid'][i], dwellings['vic_lga__3'][i] = get_lga(dwellings['x coordinate'][i], dwellings['y coordinate'][i])
# print('dwellings1')
# dwellings['pid'] = dwellings.apply(lambda x: get_lga_pid(x['x coordinate'],x['y coordinate']),axis=1)
# dwellings['vic_lga__3'] = dwellings.apply(lambda x: get_lga_lga3(x['x coordinate'],x['y coordinate']),axis=1)