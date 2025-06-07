from fastapi import Request, HTTPException
from src.services.jwt_service import verify

def authentication_middleware(request: Request):
    header = request.headers.get("Authorization")
    if not header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    try:
        scheme, token = header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        return verify(token) 
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
