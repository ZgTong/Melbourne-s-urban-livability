from shapely.geometry import Point, shape

import json

new_result = []
with open('tweet_harvesting/data/vic_geo_small.json') as fp:
    geo_info_small = json.load(fp)
    
with open('tweet_harvesting/output/historical_data_cleaned/historical_tweets_0.json') as f:
    tweets = json.load(f)
    
    
for tweet in tweets:
    point = Point(tweet["location"][0], tweet["location"][1])
    for feature in geo_info_small['features']:
        bound = shape(feature['geometry'])
        
        if bound.contains(point):
            tweet["loc_pid"] = feature['properties']["loc_pid"]
            tweet["vic_loca_2"] = feature['properties']["vic_loca_2"]
    new_result.append(tweet)        


with open('tweet_harvesting/output/historical_data_cleaned/historical_tweets_0_mod.json', 'w') as file:
    json.dump(new_result, file, indent=2)
