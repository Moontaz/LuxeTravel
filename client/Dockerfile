FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
