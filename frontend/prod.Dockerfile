#stage 1
FROM node:alpine as builder

WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm i serve -g
RUN serve -s build

#stage 2
#FROM nginx:alpine
#COPY nginx/nginx.conf /etc/nginx/nginx.conf
#COPY --from=builder /app/build /usr/share/nginx/html