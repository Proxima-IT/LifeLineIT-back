FROM node:20

# Installing pm2 in global
RUN npm install -g pm2

WORKDIR /user/src/app

COPY package*.json ./
COPY ecosystem.config.js ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["pm2-runtime", "ecosystem.config.js"]