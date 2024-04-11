FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps
