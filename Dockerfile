# base image
FROM node:12.20.2-alpine

# set working directory
WORKDIR /usr/src/app

# tools
RUN apk add --no-cache \
  mongodb \
  nano \
  curl
  # mongodb-tools

# install and cache app dependencies
COPY package*.json ./
RUN npm install --silent \
  mkdir dist config download

# copy dist
COPY ./dist ./dist
# copy self signed certificates
COPY ./config/server.* ./config/

# THE LIFE SAVER
# https://dev.to/hugodias/wait-for-mongodb-to-start-on-docker-3h8b
## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# CMD [ "node", "dist/app.js" ]
## Launch the wait tool and then your application
CMD /wait && node dist/app.js
