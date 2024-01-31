from langchain.schema import BaseRetriever
from langchain_community.vectorstores import SupabaseVectorStore


def get_retriever(vector_store: SupabaseVectorStore) -> BaseRetriever:
    """Basic retriever function to get a retriever from a vector store."""
    retriever = vector_store.as_retriever(search_kwargs={'k': 3}) # Default K is 4

    return retriever

