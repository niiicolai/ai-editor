from src.models.main import get_database

dbname = get_database()

collection = dbname["samples"]

def insert_many(samples):
    return collection.insert_many(samples)

def find(query={}):
    return collection.find(query)

def paginate(page=1, limit=10):
    skip = (page - 1) * limit
    return collection.find().sort("created_at", -1).skip(skip).limit(limit)

def count(query={}):
    return collection.count_documents(query)
