
def dto(obj):
    return {
        "_id": str(obj.get("_id", "")),
        "input_prompt": obj.get("input_prompt", ""),
        "input_embedded_files": obj.get("input_embedded_files", []),
        "output_response": obj.get("output_response", ""),
        "event": obj.get("event", ""),
        "config": {
            "llm": obj.get("config", {}).get("llm", ""),
            "embedding_model": obj.get("config", {}).get("embedding_model", ""),
            "chunking_strategy": obj.get("config", {}).get("chunking_strategy", ""),
            "search_strategy": obj.get("config", {}).get("search_strategy", ""),
        },
        "metrics": {
            "context_precision": obj.get("metrics", {}).get("context_precision", ""),
            "response_relevancy": obj.get("metrics", {}).get("response_relevancy", ""),
            "faithfulness": obj.get("metrics", {}).get("faithfulness", ""),
        },
        "created_at": obj.get("created_at", ""),
        "updated_at": obj.get("updated_at", ""),
    }
  