FROM node:16-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apt-get -qy update && apt-get -qy install openssl

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY ["prisma/schema.prisma", "./"]

RUN npx prisma generate

COPY . .

RUN npx tsc

EXPOSE 4000

CMD ["./docker-entrypoint.sh"]