from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def get_database():
 
   CONNECTION_STRING = os.getenv("MONGODB_URL")
   if CONNECTION_STRING is None: print("MONGODB_URL is not set in .env")
   
   MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME")
   if MONGODB_DB_NAME is None: print("MONGODB_DB_NAME is not set in .env")
 
   client = MongoClient(CONNECTION_STRING)
 
   return client[MONGODB_DB_NAME]
  
if __name__ == "__main__":   
   dbname = get_database()