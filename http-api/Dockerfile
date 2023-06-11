FROM node:18.13.0-alpine

WORKDIR /app

RUN mkdir -p /app

COPY . .

EXPOSE 8080

# node_modules is ignored, so it is needed to install the dependencies
RUN npm install

# RUN npm run build

CMD [ "npm", "run", "start:dev" ]
