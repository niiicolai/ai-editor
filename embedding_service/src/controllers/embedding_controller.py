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
    def embed_chunk(body: EmbeddingInput, user=Depends(authentication_middleware)):
        try:
            if not body.chunk.strip():
                raise HTTPException(status_code=400, detail="chunk is missing or empty")
            
            return embed(chunk=body.chunk, model=body.model)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Internal server error")
    
    @app.post("/api/v1/embeddings")
    def embed_chunk(body: EmbeddingsInput, user=Depends(authentication_middleware)):
        try:
            if not body.chunks or len(body.chunks) == 0:
                raise HTTPException(status_code=400, detail="chunks is missing or empty")
            
            return embed_all(chunks=body.chunks, model=body.model)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Internal server error")
