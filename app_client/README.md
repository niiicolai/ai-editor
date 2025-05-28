# App Client

# Installation

```bash
cp .env.example .env
npm install
```

# Run the client

```bash
npm run dev
```

# Cypress End-to-end test
```bash
npm run cy:run
npm run cy:open
```

# Docker

## Build Docker Image
```bash
docker build -t app_client:v1.0 .
```
## Run Docker Container
```bash
docker run -d -p 5173:5173 app_client:v1.0
```
