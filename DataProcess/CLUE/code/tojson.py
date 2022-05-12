import numpy as np
import pandas as pd
import json

data = pd.read_excel('../data_xlsx/employs.xlsx')

data_js = data.to_json(orient='records')

data_1 = open('../data_json/employs_json.json', 'w')
data_1.write(data_js)
data_1.close()