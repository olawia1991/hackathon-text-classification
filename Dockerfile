FROM node:15-alpine3.10

RUN touch /.env
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN yarn
EXPOSE 3000
CMD [ "node", "build/index.js" ]