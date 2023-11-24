FROM node:lts-alpine

WORKDIR /app

# Copy both client and server package.json files
COPY package*.json ./ 
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# RUN npm install-server --only=production

# Install dependencies
RUN npm install --only=production

COPY . .

USER node

CMD [ "npm", "start"]

EXPOSE 8000
