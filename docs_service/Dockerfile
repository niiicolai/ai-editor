# Use the official Node.js image as the base image
FROM node:24-bullseye-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install MongoDB Database Tools
RUN apt-get update && apt-get install -y wget gnupg curl && apt-get upgrade -y
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN apt-get update && apt-get install -y mongodb-database-tools mongodb-mongosh && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# Expose the port the app runs on
EXPOSE 3004

# Define the command to run the application
CMD ["npm", "start"]
