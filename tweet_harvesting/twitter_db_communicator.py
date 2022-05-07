import json
from cloudant.client import CouchDB
from matplotlib.pyplot import connect
from harvester import *


class CouchDBClient(CouchDB):
    def __init__(self, username, password, url):
        self.couch = super().__init__(username, password, url, connect=True)

    def get_database(self, db_name):
        return self.couch[db_name]

    def disconnect(self):
        self.couch.disconnect()

    def create_record(self, db_name, doc):
        
        if not self.couch[db_name].exists():
            self.create_database(db_name)
            if self.get_database(db_name).exists():
                print('SUCCESS!!')
            self.get_database(db_name).create_document(doc)
            return True
        else:
            if doc['tweet_id'] not in self.get_database(db_name):
                self.get_database(db_name).create_document(doc)
                return True
        
        return False


def main():
    files = ["tweet_harvesting/output/historical_tweets_6.json",
             "tweet_harvesting/output/historical_tweets_7.json",
             "tweet_harvesting/output/historical_tweets_8.json",
             "tweet_harvesting/output/historical_tweets_9.json"]
    
    for file in files:
        with open(file, 'r') as f:
            tweets = json.loads(f.read())
            
        DATABASE_USERNAME = 'admin'
        DATABASE_PASSWORD = 'admin'
        DATABASE_URL = 'http://172.26.133.112:5984/'
        
        total_count = len(tweets)
        saved_count = 0
        
        db_client = CouchDB(DATABASE_USERNAME, DATABASE_PASSWORD, url=DATABASE_URL, connect=True)
        print(str(db_client.all_dbs()))
        if 'user' not in db_client.all_dbs():
            db_client.create_database('user')
        
        user_db = db_client['user']
        for tweet in tweets:
            saved_count += 1
            if tweet['topic'] in ['melbourne', 'other_cities']:
                db_name = 'city'
            else: 
                db_name = tweet['topic']
            
            if db_name not in db_client.all_dbs():
                db_client.create_database(db_name)
                
            my_db = db_client[db_name]
            
            if not tweet['_id'] in my_db:
                doc = my_db.create_document(tweet)
                if not doc.exists():
                    print("Cannot add tweet: {tweet['_id]}")
                time.sleep(random.randint(0, 2))
            else:
                print(f"document {tweet['_id']} already exists.")
            
            if not tweet['user_id'] in user_db:
                user_doc = user_db.create_document({"_id": tweet['user_id'], "status": "complete"})
                if user_doc.exists():
                    print("user added")
                time.sleep(random.randint(0, 4))
                
            if saved_count % 100 == 0:
                print(f"Progress: {saved_count}/{total_count}, file :{file}")
            
        # for document in my_db:
        #     print(document)    
        # for document in user_db:
        #     print(document)    
        db_client.disconnect()

            
if __name__ == '__main__':
    main()
    # db_client = CouchDB(DATABASE_USERNAME, DATABASE_PASSWORD, url=DATABASE_URL, connect=True)
    
    # session = db_client.session()
    # print('Username: {0}'.format(session['userCtx']['name']))
    # print('Databases: {0}'.format(db_client.all_dbs()))

    # my_db = db_client['tweets']
    # user_db = db_client['users']
    
    # end_point = '{0}/{1}'.format(db_client.server_url, 'tweets/_all_docs')
    # params = {'include_docs': 'true'}

    # # Issue the request
    # response = db_client.r_session.get(end_point, params=params)

    # # Display the response content
    # print(response.json())
