#!/bin/sh

MONGO_HOST=${MONGO_HOST:-"mongodb"}
MONGO_PORT=${MONGO_PORT:-"27017"}

RABBITMQ_HOST=${RABBITMQ_HOST:-"rabbitmq"}
RABBITMQ_PORT=${RABBITMQ_PORT:-"5672"}

until mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
    echo "Waiting for MongoDB to be ready..."
    sleep 2
done
echo "MongoDB is ready!"

until nc -z "$RABBITMQ_HOST" "$RABBITMQ_PORT"; do
    echo "Waiting for RabbitMQ to be ready..."
    sleep 2
done
echo "RabbitMQ is ready!"
