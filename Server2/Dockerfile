FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 5002
CMD ["node", "app.js"]
