from transformers import AutoModel, AutoTokenizer
from sentence_transformers import SentenceTransformer

def codeT5p(chunk, device='cpu'):
    checkpoint = "Salesforce/codet5p-110m-embedding"

    tokenizer = AutoTokenizer.from_pretrained(checkpoint, trust_remote_code=True)
    model = AutoModel.from_pretrained(checkpoint, trust_remote_code=True).to(device)

    inputs = tokenizer.encode(chunk, return_tensors="pt").to(device)
    embedding = model(inputs)[0]
    
    return embedding.tolist()

def allMiniLmL6v2(chunk):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode(chunk, convert_to_tensor=True)
    return embedding.tolist()

def embed(chunk, model='Salesforce/codet5p-110m-embedding'):
    if model is None: model = 'Salesforce/codet5p-110m-embedding'
    
    if model == 'Salesforce/codet5p-110m-embedding':
        return { "chunk": chunk, "embedding": codeT5p(chunk) }
    elif model == 'all-MiniLM-L6-v2':
        return { "chunk": chunk, "embedding": allMiniLmL6v2(chunk) }
    else:
        raise Exception("Model not found")
    
def embed_all(chunks, model='Salesforce/codet5p-110m-embedding'):
    result = []
    for chunk in chunks:
        result.append(embed(chunk, model))
    return result
