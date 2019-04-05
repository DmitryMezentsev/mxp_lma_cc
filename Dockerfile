FROM node:latest

RUN mkdir -p /opt/app

COPY . /opt/app/
ENV PORT=8080
WORKDIR /opt/app

CMD sleep 1000
