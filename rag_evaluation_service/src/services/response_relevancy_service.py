from ragas import SingleTurnSample
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI
from ragas.dataset_schema import SingleTurnSample
from ragas.metrics import ResponseRelevancy
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
load_dotenv()

evaluator_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o"))
evaluator_embeddings = OpenAIEmbeddings()

async def cal_response_relevancy(user_input, response, retrieved_contexts):
    scorer = ResponseRelevancy(llm=evaluator_llm, embeddings=evaluator_embeddings)
    sample = SingleTurnSample(
        user_input=user_input,
        response=response,
        retrieved_contexts=retrieved_contexts, 
    )

    return await scorer.single_turn_ascore(sample)
