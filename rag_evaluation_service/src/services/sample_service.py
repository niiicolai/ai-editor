from src.models.sample_model import insert_many, find, paginate, count
from src.services.context_precision_service import cal_context_precision
from src.services.faithfulness_service import cal_faithfulness
from src.services.response_relevancy_service import cal_response_relevancy

def get_sample(_id):
    if _id is None: raise Exception("id is required")
    
    sample = find({ "_id": _id })
    if sample is None: raise Exception("sample not found")
    
    return sample

def get_samples(page, limit):
    if page is None: raise Exception("page is required")
    if limit is None: raise Exception("limit is required")
    
    samples = paginate(page, limit)
    total = count()
    pages = (total + limit - 1) // limit 
    return {
        "samples": samples,
        "total": total,
        "pages": pages,
        "page": page,
        "limit": limit
    }

async def create_many(body):
    for s in body:
        question = s["input_prompt"]
        answer = s["output_response"]
        retrieved_documents = [e["description"] for e in s["input_embedded_files"]]
        
        context_precision = await cal_context_precision(
            question, 
            answer,
            retrieved_documents,
        )
        
        faithfulness = await cal_faithfulness(
            question, 
            answer,
            retrieved_documents,
        )
        
        response_relevancy = await cal_response_relevancy(
            question, 
            answer,
            retrieved_documents,
        )
         
        insert_many([{
            "input_prompt": s["input_prompt"],
            "input_embedded_files": s["input_embedded_files"],
            "output_response": s["output_response"],
            "event": s["event"],
            "config": s["config"],
            "metrics": {
                "context_precision": context_precision,
                "response_relevancy": response_relevancy,
                "faithfulness": faithfulness
            }
        }])
