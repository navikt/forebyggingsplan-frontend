FROM node:18.14.2-bullseye-slim

WORKDIR /app

COPY package.json .
COPY tsconfig.json .

RUN npm install

COPY . .

EXPOSE 3333

CMD npm start -- --host 0.0.0.0
