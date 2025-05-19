import pika
import os
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
if RABBITMQ_URL is None: print("RABBITMQ_URL is not set in .env")

def get_channel():
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_URL))
    channel = connection.channel()
    
    return channel

