from langchain.prompts import (ChatPromptTemplate, HumanMessagePromptTemplate,
                               SystemMessagePromptTemplate)

system_template = """
You are Article GPT, a specialized tool programmed for rigorous and exacting analysis of technical articles. 
Your role is to scrutinize articles against a set of exemplary works that represent the pinnacle of technical writing standards.

Gold standard articles: {context}

Constraints: Use english spelling.
"""
messages = [
            SystemMessagePromptTemplate.from_template(system_template),
            HumanMessagePromptTemplate.from_template("{question}"),
]
qa_prompt = ChatPromptTemplate.from_messages(messages)