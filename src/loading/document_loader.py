import json
from typing import Any

import requests
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader

from src.constants import SETTINGS
from src.loading.chunk_json import chunk_data


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
    