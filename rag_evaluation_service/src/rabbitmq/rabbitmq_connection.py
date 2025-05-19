import pika
import os

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
if RABBITMQ_URL is None: print("RABBITMQ_URL is not set in .env")

connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_URL))
channel = connection.channel()
