import json
import random
import time
from datetime import datetime

import tweepy
from cloudant.client import CouchDB
from shapely.geometry import Point, shape

import tweetAnalyzer
from credential import *

KEYWORD_LIST = ["city", "food", "sport", "traffic_weather"]


class MyListener(tweepy.Stream):

    def __init__(self, consumer_key, consumer_secret, access_token, access_token_secret,
                 keywords, db_client=None, **kwargs):
        super().__init__(consumer_key, consumer_secret,
                         access_token, access_token_secret, **kwargs)
        self.data = list()
        self.limit = 200
        self.user_ids = set()
        self.tweet_ids = set()
        self.bounding_box = [140.9637383263, -39.1701944869,
                             150.2020069979, -33.9807673149]
        with open('tweet_harvesting/data/vic_geo.json') as f:
            self.geo_info = json.load(f)
            
        with open('tweet_harvesting/data/vic_geo_small.json') as fp:
            self.geo_info_small = json.load(fp)
            
        self.api = self.set_api()
        self.checked_tweet = 0
        self.collected_tweet = 0
        self.keywords = keywords
        self.tweetAnalyzer = tweetAnalyzer.TweetAnalyzer(keywords)
        self.db_client = db_client
        self.tweets_db = None
        self.users_db = self.db_client['user'] if self.db_client is not None else None

    def set_api(self):
        '''
        Set the Twitter API for streaming tweets
        '''
        auth = tweepy.OAuthHandler(API_KEY, API_KEY_SECRET)
        auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
        return tweepy.API(auth)
    

    def get_tweetDB(self, document):
        if document['topic'] in ['melbourne', 'other_cities']:
            db_name = 'city'
        else: 
            db_name = document['topic']
        
        return db_name
        
    def on_data(self, data):
        '''
        If a Tweet is received from the stream, the raw data is sent to Stream.on_data().
        This method is override from the parent class Tweepy.Stream in order to store/send the 
        customized document for each tweet to local/database.
        '''
        tweet = json.loads(data)
        self.checked_tweet += 1
        # print(self.checked_tweet)
        try:
            if not tweet['place']:
                return False

            if self.db_client is not None:
                self.save_to_db(tweet)
            else:
                self.save_to_local(tweet)

        except KeyError as e:
            print("exception: {}".format(e))
            pass

        if self.collected_tweet >= self.limit:
            self.disconnect()

        return True

    def on_error(self, status):
        print(status)
        return True

    def get_saved_tweets(self):
        return self.tweet_ids

    def get_saved_users(self):
        return self.user_ids

    def extract_info(self, tweet: dict):

        t_id = tweet['id_str']

        if t_id not in self.tweet_ids:
            location = self.get_location(tweet)
            location_res = self.get_lga(location)
            if len(location_res) == 6:
                location_id, location_name, id_city = location_res[0], location_res[1], location_res[2]
                loc_pid, vic_loca_2, id_suburb = location_res[3], location_res[4], location_res[5]
            elif len(location_res) == 3:
                location_id, location_name, id_city = location_res[0], location_res[1], location_res[2]
                loc_pid, vic_loca_2, id_suburb = None, None, None

            try:
                text = tweet['full_text']

            except KeyError:
                text = tweet['text']

            topic = self.tweetAnalyzer.extract_topic(text)

            if not location_name or not topic:
                return None

            sentiment = self.tweetAnalyzer.classify_text(text)

            created_at = datetime.strftime(datetime.strptime(tweet['created_at'], 
                                                             '%a %b %d %H:%M:%S +0000 %Y'), '%Y-%m-%d %H:%M:%S')
            favorite_count = tweet['favorite_count']
            retweet_count = tweet['retweet_count']

            user_id = tweet['user']['id_str']
            user_followers = tweet['user']['followers_count']

            score = (user_followers + (favorite_count +
                     retweet_count) / 2) * 0.0001 + 1

            info = {
                "_id": t_id,
                "created_at": created_at,
                "text": text,
                "topic": topic,
                "sentiment": sentiment,
                "location": location,
                "location_name": location_name,
                "location_id": location_id,
                "user_id": user_id,
                "score": score,
                "loc_pid": loc_pid,
                "vic_loca_2": vic_loca_2,
                "id_city": id_city,
                "id_suburb": id_suburb
            }

            return info

    def get_lga(self, location: list):
        point = Point(location[0], location[1])
        
        res = list()
        for feature in self.geo_info['features']:
            bound = shape(feature['geometry'])

            if bound.contains(point):
                res = [feature['properties']["lga_pid"], feature['properties']['vic_lga__3'], feature["id"]]

        for feature in self.geo_info_small['features']:
            bound = shape(feature['geometry'])
            
            if bound.contains(point):
                res.append(feature['properties']["loc_pid"])
                res.append(feature['properties']["vic_loca_2"])
                res.append(feature["id"])
        
        if res:
            return res
        else:
            return None, None, None, None, None, None

    def check_location(self, tweet: dict):
        location = self.get_location(tweet)

        if location:
            in_box_lat = self.bounding_box[0] < location[0] < self.bounding_box[2]
            in_box_long = self.bounding_box[1] < location[1] < self.bounding_box[3]

            if in_box_lat and in_box_long:
                return True

        return False

    def get_location(self, tweet: dict):

        if tweet['coordinates']:
            return tweet['coordinates']['coordinates']

        elif tweet['place']:
            try:
                lat = sum((
                    tweet["place"]["bounding_box"]["coordinates"][0][0][0],
                    tweet["place"]["bounding_box"]["coordinates"][0][2][0]
                )) / len(
                        (
                            tweet["place"]["bounding_box"]["coordinates"][0][0][0],
                            tweet["place"]["bounding_box"]["coordinates"][0][2][0]
                        )
                )
                log = sum((
                    tweet["place"]["bounding_box"]["coordinates"][0][0][1],
                    tweet["place"]["bounding_box"]["coordinates"][0][2][1]
                )) / len(
                        (
                            tweet["place"]["bounding_box"]["coordinates"][0][0][1],
                            tweet["place"]["bounding_box"]["coordinates"][0][2][1]
                        )
                )
                loc = (lat, log)
                return loc

            except TypeError:
                pass

    def write_json(self, new_data: list, filename: str):

        try:
            with open(filename, 'r+') as file:
                file_data = json.load(file)
                file_data += new_data
                file.seek(0)
                json.dump(file_data, file, indent=2)

        except:
            with open(filename, 'w') as file:
                json.dump(new_data, file, indent=2)

    def save_to_local(self, tweet: dict):
        if self.check_location(tweet) and tweet['id_str'] not in self.tweet_ids:
            obj = self.extract_info(tweet)

            if obj:
                self.tweet_ids.add(obj['_id'])
                self.data.append(obj)
                self.collected_tweet += 1

            if tweet["user"]["id_str"] not in self.user_ids:
                self.stream_user(tweet["user"]["id_str"], on_db=False)
                print(
                    f'(local mode) user: {tweet["user"]["id_str"]} completed, collected {self.collected_tweet} tweets in total.')
            else:
                print(
                    f'(local mode) user: {tweet["user"]["id_str"]} already completed.')

    def save_to_db(self, tweet: dict):
        if self.check_location(tweet):
            doc = self.extract_info(tweet)

            if doc:
                db_name = self.get_tweetDB(doc)
                if db_name not in self.db_client.all_dbs():
                    self.db_client.create_database(db_name)
                    
                self.tweets_db = self.db_client[db_name]
                if doc['_id'] not in self.tweets_db:
                    succ = self.tweets_db.create_document(doc)
                    if not succ.exists():
                        print("Cannot add tweet: {doc['_id]}")

            if tweet["user"]["id_str"] not in self.users_db:
                self.stream_user(tweet["user"]["id_str"], on_db=True)
                print(
                    f'(db mode) user: {tweet["user"]["id_str"]} completed, collected {self.collected_tweet} tweets in total.')

            else:
                print(
                    f'(db mode) user: {tweet["user"]["id_str"]} already completed')

    def stream_user(self, user_id: str, on_db: bool):
        '''
        Stream throu a specific user's timeline, extract information and collect.
        Supports both save to local and send to database, the method of duplicates detection differs.
        
        - Local: check if tweet's id is in self.tweets_ids, only make sure no duplicates for 
                 one file. Need to handle duplicates while sending to database later
                 
        - Database: check if tweet's id is in database, save if not, send to corresponding database. 
                    Can make sure no duplicates for the database
        
        '''
        total_streamed = 0
        collected = 0

        for status in tweepy.Cursor(self.api.user_timeline,
                                    user_id=user_id,
                                    tweet_mode="extended").items():
            user_tweet = status._json

            if self.check_location(user_tweet):
                user_doc = self.extract_info(user_tweet)

                if user_doc:

                    if on_db and user_id not in self.users_db:
                        db_name = self.get_tweetDB(user_doc)
                        if db_name not in self.db_client.all_dbs():
                            self.db_client.create_database(db_name)
                        
                        self.tweets_db = self.db_client[db_name]
                        if user_doc['_id'] not in self.tweets_db:
                            succ = self.tweets_db.create_document(user_doc)
                            if not succ.exists():
                                print("Cannot add tweet: {doc['_id]}")
                            
                    elif not on_db and user_doc['_id'] not in self.tweet_ids and user_id not in self.user_ids:
                        self.data.append(user_doc)
                        self.tweet_ids.add(user_doc['_id'])

                    self.collected_tweet += 1

            total_streamed += 1
            if total_streamed % 100 == 0:
                time.sleep(5)

        self.checked_tweet += total_streamed

        if on_db:
            self.users_db.create_document(
                {"_id": user_id, "status": "complete"})
        else:
            self.user_ids.add(user_id)


def main():
    keyword = ["city", "food", "sport",
               "traffic_weather"][random.randint(0, 3)]
    file_name = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    db_client = CouchDB(DATABASE_USERNAME, DATABASE_PASSWORD,
                        url=DATABASE_URL, connect=True)
    print(str(db_client.all_dbs()))

    if 'user' not in db_client.all_dbs():
        db_client.create_database('user')
        
    # db_client = None

    if db_client is not None:
        stream_tweet = MyListener(API_KEY, API_KEY_SECRET,
                                  ACCESS_TOKEN, ACCESS_TOKEN_SECRET, keyword, db_client=db_client)
    else:
        stream_tweet = MyListener(API_KEY, API_KEY_SECRET,
                                  ACCESS_TOKEN, ACCESS_TOKEN_SECRET, keyword)

    i = 0
    while True:
        print(f'Search starts on topic {stream_tweet.keywords}')

        stream_tweet.filter(languages=["en"],
                            locations=[140.9637383263, -39.1701944869, 150.2020069979, -33.9807673149])

        print(
            f'{stream_tweet.checked_tweet} tweets checked for topic {stream_tweet.keywords}, change to the next topic.')
        stream_tweet.checked_tweet = 0

        stream_tweet.write_json(stream_tweet.data, f'tweet_harvesting/output/{file_name}.json')
        stream_tweet.data = list()
        stream_tweet.collected_tweet = 0

        stream_tweet.keywords = [x for x in ["city", "food", "sport", "traffic_weather"]
                                 if x != stream_tweet.keywords][random.randint(0, 2)]
        stream_tweet.tweetAnalyzer = tweetAnalyzer.TweetAnalyzer(stream_tweet.keywords)
        i += 1
        
    if db_client:
        db_client.disconnect()


if __name__ == '__main__':
    main()
