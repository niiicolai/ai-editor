FROM node:22-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy environment files (.env) if needed
COPY .env* ./

# Install dependencies
RUN npm install
RUN npm install -g serve

# Copy the rest of the application code to the working directory
COPY . .

# Build the static files
RUN npm run build
# Build sitemap
# RUN npm run sitemap

# Expose the port your app runs on (if needed)
EXPOSE 5173

# Define the command to serve your built static files
CMD ["npx", "serve", "-s", "dist", "-l", "0.0.0.0:5173"]
