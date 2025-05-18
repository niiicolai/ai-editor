from ragas import SingleTurnSample
from ragas.metrics import BleuScore

test_data = {
    "user_input": "is the sky blue",
    "response": "the dirt is brown",
    "reference": "the dirt is brown"
}
metric = BleuScore()
test_data = SingleTurnSample(**test_data)
print(metric.single_turn_score(test_data))