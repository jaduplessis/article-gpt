from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client

from src_old.constants import SETTINGS


def create_supabase_client() -> Client:
    return create_client(
        supabase_url=SETTINGS.supabase_url, 
        supabase_key=SETTINGS.supabase_service_key.get_secret_value()
    )

def create_vector_store() -> SupabaseVectorStore:
    """Create a vector store from a Supabase table."""
    return SupabaseVectorStore(
        client=create_supabase_client(), 
        embedding=OpenAIEmbeddings(
            openai_api_key=SETTINGS.openai_api_key.get_secret_value()
            ), 
        table_name="documents", 
        query_name="match_documents",
    )

def create_vector_store_from_documents(documents: list[Document], table_name: str) -> SupabaseVectorStore:
    """Create a vector store and populate it with a list of documents."""
    
    embedding=OpenAIEmbeddings(
            openai_api_key=SETTINGS.openai_api_key.get_secret_value()
            )
    client=create_supabase_client()

    return SupabaseVectorStore.from_documents(
        documents=documents,
        embedding=embedding,
        client=client,
        table_name=table_name,
        query_name="match_documents",
        # Lower chunk to prevent timeout
        chunk_size=100,
    )