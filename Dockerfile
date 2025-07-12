FROM node:20

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

RUN redis-cli -h redis FLUSHALL

CMD ["node", "server.js"]
