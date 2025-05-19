from ragas import SingleTurnSample
from ragas.metrics import LLMContextPrecisionWithoutReference
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

evaluator_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o"))

async def cal_context_precision(user_input, response, retrieved_contexts):
    context_precision = LLMContextPrecisionWithoutReference(llm=evaluator_llm)
    sample = SingleTurnSample(
        user_input=user_input,
        response=response,
        retrieved_contexts=retrieved_contexts, 
    )

    return await context_precision.single_turn_ascore(sample)
