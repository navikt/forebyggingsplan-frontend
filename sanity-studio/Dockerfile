FROM node:19.0.0-alpine3.16

WORKDIR /app

COPY package.json .
COPY tsconfig.json .

RUN npm install

COPY . .

EXPOSE 3333

CMD npm start -- --host 0.0.0.0
