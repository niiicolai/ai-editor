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


# Docker

## Build Docker Image
```bash
docker build -t app_client:v1.0 .
```
## Run Docker Container
```bash
docker run -d -p 5174:5174 app_client:v1.0
```
