import asyncio
import datetime
from src.models.sample_model import insert_many, find, paginate, count
from src.services.context_precision_service import cal_context_precision
from src.services.faithfulness_service import cal_faithfulness
from src.services.response_relevancy_service import cal_response_relevancy
from src.dto.sample_dto import dto

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
    # Calculate averages for metrics across samples
    if samples:
        total_context_precision = sum(s.get("metrics", {}).get("context_precision", 0) for s in samples)
        total_response_relevancy = sum(s.get("metrics", {}).get("response_relevancy", 0) for s in samples)
        total_faithfulness = sum(s.get("metrics", {}).get("faithfulness", 0) for s in samples)
        count_samples = len(samples)
        average_context_precision = total_context_precision / count_samples
        average_response_relevancy = total_response_relevancy / count_samples
        average_faithfulness = total_faithfulness / count_samples
    else:
        average_context_precision = 0
        average_response_relevancy = 0
        average_faithfulness = 0
    
    return {
        "samples": [dto(s) for s in samples],
        "total": total,
        "pages": pages,
        "page": page,
        "limit": limit,
        "stats": {
            "average_context_precision": average_context_precision,
            "average_response_relevancy": average_response_relevancy,
            "average_faithfulness": average_faithfulness
        }
    }

async def create_many(body):
    samples_to_insert = []
    for s in body:
        question = s.get("input_prompt")
        answer = s.get("output_response")
        embedded_files = s.get("input_embedded_files", [])
        retrieved_documents = [e.get("description", "") for e in embedded_files]

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
