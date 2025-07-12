FROM node:20

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

CMD ["node", "server.js"]
