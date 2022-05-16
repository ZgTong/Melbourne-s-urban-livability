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

#stage 1
FROM node:alpine as builder

WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

#stage 2
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
