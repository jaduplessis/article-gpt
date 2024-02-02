from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI
from llm.qa_prompt import qa_prompt

from constants import SETTINGS
from retrieval.retriever import get_retriever
from retrieval.vector_store import create_vector_store


def get_qa_chain(test: bool = False) -> ConversationalRetrievalChain:
    """Get a QA chain with the correct settings."""
    if test:
        openai_model = SETTINGS.openai_model_test
    else:
        openai_model = SETTINGS.openai_model

    llm = ChatOpenAI(
        openai_api_key=SETTINGS.openai_api_key.get_secret_value(),
        model=openai_model,
        temperature=SETTINGS.temperature,
        streaming=True,
    )

    vector_store = create_vector_store()
    retriever = get_retriever(vector_store)

    # Give the chain a memory to store the conversation history
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    # Use a faster model for condensing the question
    qa = ConversationalRetrievalChain.from_llm(
        llm, 
        retriever=retriever,
        verbose=True,
        memory=memory,
        combine_docs_chain_kwargs={'prompt': qa_prompt}
    )

    return qa
