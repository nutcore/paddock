FROM node:4.4
# FROM mhart/alpine-node:4.4

# Install parse-server into a Docker Image for caching
RUN npm install -g parse-server@2.2.9

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
