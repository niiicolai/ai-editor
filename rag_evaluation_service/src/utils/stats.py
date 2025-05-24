import statistics

def cal_stats(samples):
    if not samples:
        return {
                "average_context_precision": 0,
                "median_context_precision": 0,
                "average_response_relevancy": 0,
                "median_response_relevancy": 0,
                "average_faithfulness": 0,
                "median_faithfulness": 0,
                "min_context_precision": 0,
                "max_context_precision": 0,
                "min_response_relevancies": 0,
                "max_response_relevancies": 0,
                "min_faithfulnesses": 0,
                "max_faithfulnesses": 0
            }

    context_precisions = [s.get("metrics", {}).get("context_precision", 0) for s in samples]
    response_relevancies = [s.get("metrics", {}).get("response_relevancy", 0) for s in samples]
    faithfulnesses = [s.get("metrics", {}).get("faithfulness", 0) for s in samples]
    count = len(samples)

    return {
            "average_context_precision": sum(context_precisions) / count,
            "median_context_precision": statistics.median(context_precisions),
            "average_response_relevancy": sum(response_relevancies) / count,
            "median_response_relevancy": statistics.median(response_relevancies),
            "average_faithfulness": sum(faithfulnesses) / count,
            "median_faithfulness": statistics.median(faithfulnesses),
            "min_context_precision": min(context_precisions),
            "max_context_precision": max(context_precisions),
            "min_response_relevancies": min(response_relevancies),
            "max_response_relevancies": max(response_relevancies),
            "min_faithfulnesses": min(faithfulnesses),
            "max_faithfulnesses": max(faithfulnesses)
      
    }
