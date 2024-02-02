from langchain.prompts import (ChatPromptTemplate, HumanMessagePromptTemplate,
                               SystemMessagePromptTemplate)

system_template = """You are Article GPT, an advanced editing tool designed to assess the introduction and conclusions of technical articles with respect to the standards set by the exemplary gold standard articles.

Gold Standard Articles:
{context}

Constraints: Use english spelling
"""

messages = [
            SystemMessagePromptTemplate.from_template(system_template),
            HumanMessagePromptTemplate.from_template("{question}"),
]
prompt = ChatPromptTemplate.from_messages(messages)


def format_question_prompt(draft):
    """Format the question prompt to compile the original draft followed by suggested edits."""
    return f"""Original Draft:
    {draft}

    Your task is to review the original draft and provide detailed commentary on the introduction and conclusion. Please list your comments in a clear and organized manner after the feedback. For each comment, reference the part of the original draft it applies to, and provide a clear description or example of the change. This structured approach will help track changes more efficiently.

    For all suggested edits, please use the following format:
    Original chunk of writing: <writing>
    Suggested edit: <edit>
    Reasoning: <reason>

    If you have no comments, please write "No comments."
    """
