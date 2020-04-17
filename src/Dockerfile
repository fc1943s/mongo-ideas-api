FROM node:13.13.0-buster
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

CMD ["yarn", "start"]
