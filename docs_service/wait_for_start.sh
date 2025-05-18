#!/bin/sh

MONGO_HOST=${MONGO_HOST:-"mongodb"}
MONGO_PORT=${MONGO_PORT:-"27017"}

until mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
    echo "Waiting for MongoDB to be ready..."
    sleep 2
done
echo "MongoDB is ready!"

echo "Configuring MongoDB replica set"
# configure the replica set by connecting with mongosh
mongosh --host "$MONGO_HOST" --port "$MONGO_PORT" --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: '$MONGO_HOST:$MONGO_PORT'}]})"

echo "Running migrations"
npm run mongo:migrate

echo "Starting the application"
npm start
