from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI

from src.constants import SETTINGS
from src.retrieval.retriever import get_retriever
from src.retrieval.vector_store import create_vector_store


class ChatQuery:
    def __init__(self, query):
        self.query = query

def get_qa_chain(qa_prompt: str) -> ConversationalRetrievalChain:
    """Get a QA chain with the correct settings."""

    llm = ChatOpenAI(
        openai_api_key=SETTINGS.openai_api_key.get_secret_value(),
        model=SETTINGS.openai_model,
        temperature=SETTINGS.temperature,
        streaming=True,
    )

    vector_store = create_vector_store()
    retriever = get_retriever(vector_store)

    # Give the chain a memory to store the conversation history
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True) #return_messages=True

    print(f'QA prompt: {qa_prompt}')
    # Use a faster model for condensing the question
    qa = ConversationalRetrievalChain.from_llm(
        llm, 
        retriever=retriever,
        verbose=True,
        memory=memory,
        condense_question_llm = ChatOpenAI(
            temperature=0, model='gpt-3.5-turbo', openai_api_key=SETTINGS.openai_api_key.get_secret_value()
            ),
        combine_docs_chain_kwargs={'prompt': qa_prompt}
    )

    return qa
