# Nginx

# Docker

### Build Docker Image
```bash
docker build -t editor_nginx:v1.0 .
```

### Run Docker Container
```bash
docker run -d -p 80:80 -p 443:443 editor_nginx:v1.0
```
