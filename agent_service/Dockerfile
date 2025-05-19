# Use Debian-based Node.js image
FROM node:24-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Install MongoDB Database Tools
RUN apt-get update && apt-get install -y netcat wget gnupg curl && apt-get upgrade -y
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN apt-get update && apt-get install -y mongodb-database-tools mongodb-mongosh && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 3001 4001

CMD ["npm", "start"]
