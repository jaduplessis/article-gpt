from langchain.prompts import (ChatPromptTemplate, HumanMessagePromptTemplate,
                               SystemMessagePromptTemplate)

system_template = """You are Article GPT, an advanced editing tool designed to refine and enhance technical articles. Your task is to revise the provided draft article using the feedback given and in alignment with the standards set by the exemplary gold standard articles.

Gold Standard Articles:
{context}

Your task is to create a revised version of the draft article and improve on it according to the feedback.

Constraints: Use english spelling
"""

messages = [
            SystemMessagePromptTemplate.from_template(system_template),
            HumanMessagePromptTemplate.from_template("{question}"),
]
qa_edit_prompt = ChatPromptTemplate.from_messages(messages)


def format_question_prompt(feedback, draft):
    """Format the question prompt to compile the original draft followed by suggested edits."""
    return f"""Original Draft:
    {draft}

    Feedback:
    {feedback}

    Your task is to review the original draft and suggest specific edits. Please list your suggested edits in a clear and organized manner after the feedback. For each suggested edit, reference the part of the original draft it applies to, and provide a clear description or example of the change. This structured approach will help track changes more efficiently.

    For all suggested edits, please use the following format:
    Original chunk of writing: <writing>
    Suggested edit: <edit>
    Reasoning: <reason>

    """
