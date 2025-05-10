# Documentation Service

# Installation

```bash
cp .env.example .env
npm install
```

# Run the service

```bash
npm start
```

# Test the service

```bash
npm test
```

# API Documentation

1. Start server
2. Visit http://localhost:3004/api-docs/

# Database

## Run Migration
```bash
npm run mongo:migrate
```
## Run Undo Migration
```bash
npm run mongo:migrate:undo
```
## Generate Migration
```bash
npm run mongo:generate:migration <name>
```

# Docker

## Build Docker Image
```bash
docker build -t documentation_service .
```
## Run Docker Container
```bash
docker run -d -p 3002:3002 --name documentation_service documentation_service
```
