import emoji
import json
from textblob import Blobber
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import re
import nltk
nltk.download("stopwords")
from nltk.corpus import stopwords

class TweetAnalyzer():
    
    def __init__(self, keywords):
        with open('data/keywords.json', 'r') as f:
            self.full_keyword_dict = json.load(f)
            
        # topic: city, food, sport, traffic_weather
        self.topic = list(self.full_keyword_dict[keywords].keys())[0]
        # dictionary type
        self.keywords = self.full_keyword_dict[keywords]
    
    
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
                        if key in ["NSW", "VIC", "QLD", "TAS", "WA", "SA", "NT"]:
                            return "melbourne" if key == "VIC" else "other_cities"
                        
                        return key
                
        return None
    
    
    def classify_text(self, text):
        
        cleaned_text = self.clean_text(text)

        blobber = Blobber(analyzer=NaiveBayesAnalyzer())
        sentences = TextBlob(cleaned_text).sentences
        pos, neg = 0, 0
        for s in sentences:
            blob = blobber(str(s))

            if blob.sentiment.classification == "pos":
                pos += 1
            else:
                neg += 1
        
        if pos == neg:
            res = "neu"
        elif pos > neg:
            res = "pos"
        else:
            res = "neg"
            
        return res
    
    
    
if __name__ == "__main__":
    
    txt = "@dan_buchner @ScottMorrisonMP Didn't Morrison, as one of the troika that took over the NSW party, just endorse her as the candidate? \n\n 👍 He can hardly bin someone when he is almost completely responsible for putting forward  and for the lack of vetting."
    
    classifier = TweetAnalyzer("city")
    print(classifier.extract_topic(txt))
    res = classifier.classify_text(txt)
    print(res)
