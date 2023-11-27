FROM node:18.15.0

WORKDIR /app

COPY package*.json ./

COPY client/ client/
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm run install-client --only=production

RUN npm run install-server --only=production

RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm","run", "deploy" ]

EXPOSE 8000