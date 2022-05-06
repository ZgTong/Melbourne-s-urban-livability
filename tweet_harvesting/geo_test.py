from shapely.geometry import Point, shape

import json

new_result = []
with open('tweet_harvesting/data/vic_geo_small.json') as fp:
    geo_info_small = json.load(fp)
    
with open('tweet_harvesting/data/vic_geo.json') as fp1:
    geo_info = json.load(fp1)
    
with open('tweet_harvesting/output/2022-05-05_12-26-48.json') as f:
    tweets = json.load(f)
    
    
for tweet in tweets:
    try:
        location_id = tweet['location_id']
        loc_pid = tweet["loc_pid"]
        
        for feature in geo_info_small['features']:
            if feature['properties']["loc_pid"] == loc_pid:
                tweet["id_suburb"] = feature["id"]
            
                
        for feature in geo_info['features']:
            if feature['properties']["lga_pid"] == location_id:
                tweet["id_city"] = feature["id"]
                
    except KeyError:
        point = Point(tweet["location"][0], tweet["location"][1])
        for feature in geo_info_small['features']:
            bound = shape(feature['geometry'])
            
            if bound.contains(point):
                tweet["id_suburb"] = feature["id"]
                
        for feature in geo_info['features']:
            bound = shape(feature['geometry'])
            if bound.contains(point):
                tweet["id_city"] = feature["id"]
                
    new_result.append(tweet)        


with open('tweet_harvesting/output/2022-05-05_12-26-48_mode.json', 'w') as file:
    json.dump(new_result, file, indent=2)
