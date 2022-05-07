import emoji
import json
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re
import nltk
nltk.download("stopwords")
from nltk.corpus import stopwords
import nltk.data


class TweetAnalyzer():
    
    def __init__(self, keywords):
        with open('tweet_harvesting/data/keywords.json', 'r') as f:
            self.full_keyword_dict = json.load(f)
            
        # topic: city, food, sport, traffic_weather
        self.topic = list(self.full_keyword_dict[keywords].keys())[0]
        # dictionary type
        self.keywords = self.full_keyword_dict[keywords]
        self.tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
    
    
    def clean_text(self, text):
        
        text = emoji.demojize(text, delimiters=("", ""))
        text = re.sub(r"http\S+", "", text)
        text = re.sub("(@[A-Za-z0-9_]+) | ([ ^ 0-9A-Za-z \t]) | (\w+: \/\/\S+)", "", text)
        text = text.replace("_", " ")
        
        new_words = []
        for word in text.split():
            if word != '' and word not in stopwords.words('english'):
                new_words.append(word.lower())
        
        return ' '.join(new_words)
    
    
    def extract_topic(self, text):
        
        cleaned_text = self.clean_text(text).split()
        
        if type(self.keywords) is dict:
            for key, value in self.keywords.items():
                for v in value:
                    if v in cleaned_text:
                        if key in ["NSW", "VIC", "QLD", "TAS", "WA", "SA", "NT", "ACT"]:
                            return "melbourne" if key == "VIC" else "other_cities"
                        
                        return key
                
        return None
    
    
    def classify_text(self, text):
        
        cleaned_text = self.clean_text(text)
        sid_obj = SentimentIntensityAnalyzer()
        sentences = self.tokenizer.tokenize(cleaned_text)
        pos, neg, neu = 0, 0, 0
        
        for s in sentences:
            sentiment_dict = sid_obj.polarity_scores(s)

            if sentiment_dict['compound'] >= 0.05:
                pos += 1
            elif sentiment_dict['compound'] <= - 0.05:
                neg += 1
            else:
                neu += 1
        
        max_score = max([pos, neg, neu])
        if pos == max_score:
            res = 'pos'
        elif neg == max_score:
            res = 'neg'
        else:
            res = 'neu'
            
        return res
    
    
    
if __name__ == "__main__":
    
    txt = "@dan_buchner @ScottMorrisonMP Didn't Morrison, as one of the troika that took over the NSW party, just endorse her as the candidate? \n\n 👍 He can hardly bin someone when he is almost completely responsible for putting forward  and for the lack of vetting."
    
    classifier = TweetAnalyzer("city")
    print(classifier.extract_topic(txt))
    res = classifier.classify_text(txt)
    print(res)
