from ragas import SingleTurnSample
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI
from ragas.dataset_schema import SingleTurnSample
from ragas.metrics import Faithfulness
from dotenv import load_dotenv

load_dotenv()

evaluator_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o"))

async def cal_faithfulness(user_input, response, retrieved_contexts):
    scorer = Faithfulness(llm=evaluator_llm)
    sample = SingleTurnSample(
        user_input=user_input,
        response=response,
        retrieved_contexts=retrieved_contexts, 
    )

    return await scorer.single_turn_ascore(sample)
