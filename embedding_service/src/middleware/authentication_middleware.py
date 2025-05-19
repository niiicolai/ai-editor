from fastapi import Request, HTTPException
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
if SECRET_KEY is None: print("JWT_SECRET is not set in .env")

def authentication_middleware(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload 
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

