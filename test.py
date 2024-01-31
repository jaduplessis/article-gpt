import json
import os

import bs4
import requests
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores.chroma import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate

os.environ['OPENAI_API_KEY'] = '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'

article_context_urls = [
    'https://medium.com/serverless-transformation/building-a-robust-serverless-messaging-service-with-amazon-eventbridge-pipes-and-cdk-bf8250d10825',
    'https://medium.com/serverless-transformation/enabling-the-optimal-serverless-platform-team-cdk-and-team-topologies-fe4d9299adc9',
]


def rag(article_notes):
    loader = WebBaseLoader(web_paths=article_context_urls)
    docs = loader.load()

    splits = RecursiveCharacterTextSplitter()
    docs = splits.split_documents(docs)

    db = Chroma.from_documents(documents=docs, embedding=OpenAIEmbeddings())
    retriever = db.as_retriever()

    llm = ChatOpenAI(
        model="gpt-4",
        verbose=True,
    )

    template = """You are ArticleGPT. Your job is to finish an article which is ready to publish. Below is the user notes which you must make into a full article:
    
    {user_notes}
    
    Use the above unfinished user notes to write a full article. The article should be at least 500 words long. The article should be written in the same style as the articles below:
    
    {article_contexts}
    """

    prompt = PromptTemplate.from_template(template=template, article_notes=article_notes)

    chain = 



load('https://medium.com/serverless-transformation/building-a-robust-serverless-messaging-service-with-amazon-eventbridge-pipes-and-cdk-bf8250d10825')


def read(index_name):
    # Set the url
    url = f'https://api.turbopuffer.com/v1/vectors/{index_name}'

    # Make the GET request
    response = requests.get(url, headers=headers)
    print(json.dumps(response.text, indent=4, sort_keys=True))


read(turbopuffer_index_name)