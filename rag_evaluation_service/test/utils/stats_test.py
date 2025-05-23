import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from rag_evaluation_service.src.utils.stats import cal_stats
import pytest

@pytest.mark.parametrize(
    "samples, results", [
        ([{
            "metrics": {
            "context_precision": 1,
            "response_relevancy": 1,
            "faithfulness": 1
            }
        }, {
            "metrics": {
            "context_precision": 0.5,
            "response_relevancy": 0.5,
            "faithfulness": 0.5
            }
        }],
        {
            "average_context_precision": 0.75,
                "median_context_precision": 0.75,
                "average_response_relevancy": 0.75,
                "median_response_relevancy": 0.75,
                "average_faithfulness": 0.75,
                "median_faithfulness": 0.75,
                "min_context_precision": 0.5,
                "max_context_precision": 1,
                "min_response_relevancies": 0.5,
                "max_response_relevancies": 1,
                "min_faithfulnesses": 0.5,
                "max_faithfulnesses": 1
        }),
    ]
)
def test_cal_stats_valid_partitions(samples, results):
    stats = cal_stats(samples)

    assert stats["stats"]["average_context_precision"] == results["average_context_precision"]
    assert stats["stats"]["median_context_precision"] == results["median_context_precision"]
    assert stats["stats"]["average_response_relevancy"] == results["average_response_relevancy"]
    assert stats["stats"]["median_response_relevancy"] == results["median_response_relevancy"]
    assert stats["stats"]["average_faithfulness"] == results["average_faithfulness"]
    assert stats["stats"]["median_faithfulness"] == results["median_faithfulness"]
    assert stats["stats"]["min_context_precision"] == results["min_context_precision"]
    assert stats["stats"]["max_context_precision"] == results["max_context_precision"]
    assert stats["stats"]["min_response_relevancies"] == results["min_response_relevancies"]
    assert stats["stats"]["max_response_relevancies"] == results["max_response_relevancies"]
    assert stats["stats"]["min_faithfulnesses"] == results["min_faithfulnesses"]
    assert stats["stats"]["max_faithfulnesses"] == results["max_faithfulnesses"]
