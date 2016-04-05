FROM node:4.4
# FROM mhart/alpine-node:4.4

RUN npm install -g parse-server@2.2.4

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
