from fastapi import HTTPException, Depends
from src.services.sample_service import get_sample, get_samples
from src.middleware.authentication_authorization_middleware import authentication_authorization_middleware
        
def sample_controller(app):

    @app.get("/api/v1/sample/{id}")
    def get_sample_route(id: int, user=Depends(authentication_authorization_middleware)):
        try:
            return get_sample(id)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Internal server error")
    
    @app.get("/api/v1/samples")
    def get_samples_route(
        page: int = 1,
        limit: int = 10,
        user=Depends(authentication_authorization_middleware)
    ):
        try:
            if page < 1:
                raise HTTPException(status_code=400, detail="Page must be at least 1")
            if limit > 120:
                raise HTTPException(status_code=400, detail="Limit cannot exceed 120")

            return get_samples(page=page, limit=limit)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Internal server error")
