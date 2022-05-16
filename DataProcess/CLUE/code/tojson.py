# Part of Assignment 2 - COMP90024 Cluster and Cloud Computing 2022 S1
#
# Team 28
# 
# Authors: 
#
#  * Yuanzhi Shang (Student ID: 1300135)
#  * Zuguang Tong (Student ID: 1273868)
#  * Ruoyi Gan (Student ID: 987838)
#  * Zixuan Guo (Student ID: 1298930)
#  * Jingyu Tan (Student ID: 1184788)
#
# Location: Melbourne
#

import numpy as np
import pandas as pd
import json

data = pd.read_excel('../data_xlsx/employs.xlsx')

data_js = data.to_json(orient='records')

data_1 = open('../data_json/employs_json.json', 'w')
data_1.write(data_js)
data_1.close()
