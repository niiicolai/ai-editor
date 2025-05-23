import asyncio
import datetime
import json
from src.models.sample_model import insert_many, find, paginate, count
from src.ragas.main import cal_context_precision, cal_faithfulness, cal_response_relevancy
from src.dto.sample_dto import dto
from src.utils.stats import cal_stats
        

def get_sample(_id):
    if _id is None: raise Exception("id is required")
    
    sample = find({ "_id": _id })
    if sample is None: raise Exception("sample not found")
    
    return dto(sample)

def get_samples(page, limit):
    if page is None: raise Exception("page is required")
    if limit is None: raise Exception("limit is required")
    
    samples_cursor = paginate(page, limit)
    samples = list(samples_cursor)
    total = count()
    pages = (total + limit - 1) // limit 
    
    return {
        "samples": [dto(s) for s in samples],
        "total": total,
        "pages": pages,
        "page": page,
        "limit": limit,
        "stats": cal_stats(samples)
    }

async def create_many(body):
    samples_to_insert = []
    for s in body:
        question = s.get("input_prompt")
        answer = s.get("output_response")
        embedded_files = s.get("input_embedded_files", [])
        retrieved_documents = [json.dumps(e) for e in embedded_files]

        context_precision, faithfulness, response_relevancy = await asyncio.gather(
            cal_context_precision(question, answer, retrieved_documents),
            cal_faithfulness(question, answer, retrieved_documents),
            cal_response_relevancy(question, answer, retrieved_documents)
        )

        sample = {
            "input_prompt": question,
            "input_embedded_files": embedded_files,
            "output_response": answer,
            "event": s.get("event"),
            "config": s.get("config"),
            "metrics": {
                "context_precision": context_precision,
                "response_relevancy": response_relevancy,
                "faithfulness": faithfulness
            },
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now()
        }
        samples_to_insert.append(sample)

    if samples_to_insert:
        insert_many(samples_to_insert)
