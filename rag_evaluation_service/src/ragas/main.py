from ragas import SingleTurnSample
from ragas.metrics import LLMContextPrecisionWithoutReference
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import Faithfulness, ResponseRelevancy
from langchain_openai import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv
import os
load_dotenv()

evaluator_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o-mini"))
evaluator_embeddings = OpenAIEmbeddings()

async def cal_context_precision(user_input, response, retrieved_contexts):
    if os.getenv("ENV") == "test": return 0
    
    context_precision = LLMContextPrecisionWithoutReference(llm=evaluator_llm)
    sample = SingleTurnSample(
        user_input=user_input,
        response=response,
        retrieved_contexts=retrieved_contexts, 
    )

    return await context_precision.single_turn_ascore(sample)

async def cal_faithfulness(user_input, response, retrieved_contexts):
    if os.getenv("ENV") == "test": return 0
    
    scorer = Faithfulness(llm=evaluator_llm)
    sample = SingleTurnSample(
        user_input=user_input,
        response=response,
        retrieved_contexts=retrieved_contexts, 
    )

    return await scorer.single_turn_ascore(sample)

async def cal_response_relevancy(user_input, response, retrieved_contexts):
    if os.getenv("ENV") == "test": return 0
    
    scorer = ResponseRelevancy(llm=evaluator_llm, embeddings=evaluator_embeddings)
    sample = SingleTurnSample(
        user_input=user_input,
        response=response,
        retrieved_contexts=retrieved_contexts, 
    )

    return await scorer.single_turn_ascore(sample)