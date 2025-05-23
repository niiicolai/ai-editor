# Embedding Service

## Virtual Environment 

### Activate
```
source venv/bin/activate 2>/dev/null || venv\Scripts\activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null && echo "Virtual environment activated." || echo "Failed to activate virtual environment.
```

## Installation

### Load requirements
```
pip install -r requirements.txt
```

### Configure environment variables
```
cp .env.example .env
```

## Development

### Start server
```
python main.py
```

## Test

### Run Test
```
pytest
```

### Update requirements
```
pip freeze > requirements.txt
```

### API Documentation
1. Start server
2. Visit http://localhost:3003/docs#/

# Docker

### Build Docker Image
```bash
docker build -t embedding_service:v1.0 .
```

### Run Docker Container
```bash
docker run -d -p 3003:3003 embedding_service:v1.0
```
