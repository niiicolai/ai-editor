from fastapi import Request, HTTPException
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
if SECRET_KEY is None: print("JWT_SECRET is not set in .env")

def verify(token):
    if SECRET_KEY is None:
        raise Exception("JWT_SECRET is not set in .env")
    if token is None: raise Exception("Token is required")
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"]) 

def generate(_id, role):
    if SECRET_KEY is None:
        raise Exception("JWT_SECRET is not set in .env")
    if _id is None: raise Exception("_id is required")
    if role is None: raise Exception("Role is required")
    payload = {"_id": _id, "role": role}
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token