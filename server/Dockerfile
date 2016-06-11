FROM node:6.2
# FROM mhart/alpine-node:6.2

# Install parse-server into a Docker Image for caching
RUN npm install -g parse-server@2.2.12

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
