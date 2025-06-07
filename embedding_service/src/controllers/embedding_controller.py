from fastapi import HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from src.services.embedding_service import embed, embed_all
from src.middleware.authentication_middleware import authentication_middleware

class EmbeddingInput(BaseModel):
        chunk: str
        model: Optional[str] = None

class EmbeddingsInput(BaseModel):
        chunks: List[str]
        model: Optional[str] = None
        
def embeddingController(app):

    @app.post("/api/v1/embedding")
    def _embed(body: EmbeddingInput, _user=Depends(authentication_middleware)):
        try:
            return embed(chunk=body.chunk, model=body.model)
        except Exception as e:
            if isinstance(e, HTTPException): raise e
            else: raise HTTPException(status_code=500, detail="Internal server error")
             
    
    @app.post("/api/v1/embeddings")
    def _embed_all(body: EmbeddingsInput, user=Depends(authentication_middleware)):
        try:
            return embed_all(chunks=body.chunks, model=body.model)
        except Exception as e:
            if isinstance(e, HTTPException): raise e
            else: raise HTTPException(status_code=500, detail="Internal server error")
