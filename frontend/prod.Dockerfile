#stage 1
FROM node:alpine as builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

#stage 2
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html