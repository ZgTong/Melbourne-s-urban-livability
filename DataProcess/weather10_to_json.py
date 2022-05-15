import numpy as np
import pandas as pd
import json

data = pd.read_excel('weather_past10years.xlsx')

print(data.head())


# data_js = data.to_json(orient='records')

# data_1 = open('after_weather10_json.json', 'w')
# data_1.write(data_js)
# data_1.close()


