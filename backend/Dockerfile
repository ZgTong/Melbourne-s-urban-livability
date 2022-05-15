# syntax=docker/dockerfile:1

FROM golang:latest

WORKDIR /app
ENV GO111MODULE on
ENV GOPROXY https://goproxy.cn,direct
COPY . .

RUN go mod download
RUN go build ./starter/ccc.go

EXPOSE 8080

CMD [ "/app/ccc" ]