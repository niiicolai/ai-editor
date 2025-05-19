import os
import uvicorn

from dotenv import load_dotenv
from fastapi import FastAPI
from src.controllers.sample_controller import sample_controller
from src.rabbitmq.sagas.new_sample_saga import start_consumer_thread

app = FastAPI()

load_dotenv()
sample_controller(app)
start_consumer_thread()

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
