from typing import Any

from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader

from src.constants import SETTINGS
from src.retrieval.vector_store import create_vector_store_from_documents


def load_doc_route():
    """Route to load primary document of focus into vector store"""

    print("Loading primary document into vector store...")
    document = get_doc_from_source()
    print(document)
    split_document = split_docs_array(document)

    print(f"Number of documents: {len(split_document)}")

    create_vector_store_from_documents(split_document, 'documents')

    return "Documents loaded into vector store."


def get_doc_from_source() -> Document:
    # Load primary document into a Document object using the WebBaseLoader
    loader = WebBaseLoader(web_paths=SETTINGS.docs_url)
    doc = loader.load()

    return doc


def split_docs_array(docs_array: list[Document]) -> list[Document]:
    """
    Splits the page content of each document in the array into chunks of 5000 characters.
    """
    splitter = RecursiveCharacterTextSplitter(chunk_size=5000)
    return splitter.split_documents(docs_array)
    