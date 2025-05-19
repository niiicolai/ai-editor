import os
import uvicorn

from dotenv import load_dotenv
from fastapi import FastAPI
from src.controllers.embedding_controller import embeddingController

load_dotenv()

app = FastAPI()

embeddingController(app)

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    print(f"running on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
