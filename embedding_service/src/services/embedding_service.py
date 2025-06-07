import torch
from transformers import AutoModel, AutoTokenizer
from sentence_transformers import SentenceTransformer
from fastapi import HTTPException

def codeT5p(chunks, device='cpu'):
    checkpoint = "Salesforce/codet5p-110m-embedding"
    tokenizer = AutoTokenizer.from_pretrained(checkpoint, trust_remote_code=True)
    model = AutoModel.from_pretrained(checkpoint, trust_remote_code=True).to(device)
    inputs = tokenizer(chunks, return_tensors="pt", padding=True, truncation=True).to(device)
    with torch.no_grad():
        outputs = model(**inputs)

    if isinstance(outputs, tuple): embeddings = outputs[0]
    else: embeddings = outputs

    if hasattr(embeddings, "tolist"):
        embeddings = embeddings.tolist()
    return embeddings

def allMiniLmL6v2(chunks):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(chunks, convert_to_tensor=True)
    return embeddings.tolist()

def embed(chunk, model='Salesforce/codet5p-110m-embedding'):
    if chunk is None: raise HTTPException(status_code=400, detail="Chunk is required")
    if model is None: raise HTTPException(status_code=400, detail="Model is required")
    
    if model == 'Salesforce/codet5p-110m-embedding':
        return { "chunk": chunk, "embedding": codeT5p([chunk])[0] }
    elif model == 'all-MiniLM-L6-v2':
        return { "chunk": chunk, "embedding": allMiniLmL6v2([chunk])[0] }
    else:
        raise HTTPException(status_code=400, detail="Unsupported Model")

def embed_all(chunks, model='Salesforce/codet5p-110m-embedding'):
    if chunks is None: raise HTTPException(status_code=400, detail="Chunks is required")
    if model is None: raise HTTPException(status_code=400, detail="Model is required")
    
    if model == 'Salesforce/codet5p-110m-embedding':
        embeddings = codeT5p(chunks)
    elif model == 'all-MiniLM-L6-v2':
        embeddings = allMiniLmL6v2(chunks)
    else:
        raise HTTPException(status_code=400, detail="Unsupported Model")
    
    return [{"chunk": chunk, "embedding": embedding} for chunk, embedding in zip(chunks, embeddings)]
