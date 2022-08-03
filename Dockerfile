FROM node:lts

WORKDIR /app

COPY package.json ./

COPY tsconfig.json ./

COPY ./prisma ./app/prisma/

COPY .env ./

COPY . .

# RUN apt-get add --update && apk add --update openssl

RUN apt-get -qy update && apt-get -qy install openssl

RUN npx prisma generate --schema ./app/prisma/schema.prisma

RUN yarn

# RUN yarn add @prisma/client

EXPOSE 3001