from src.llm.edit_prompts import format_question_prompt, qa_edit_prompt
from src.llm.qa_chain import get_qa_chain
from src.llm.review_prompts import qa_review_prompt
from src.llm.tone_prompts import qa_tone_prompt
from src.loading.document_loader import get_doc_from_source, split_docs_array
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


# Function to save the text to a markdown file
def save_text(text: str, file_name: str) -> None:
    """Save the text to a markdown file."""
    output_dir = "src/output"
    output_file = f"{output_dir}/{file_name}"
    with open(output_file, "w") as file:
        file.write(text)


def get_review(doc):
    """Get the review for the document."""
    chain = get_qa_chain(qa_review_prompt)
    
    result = chain({
        "question": doc,
    })

    return result["answer"]


def get_edits(doc, feedback):
    """Get the edits for the document."""
    chain = get_qa_chain(qa_edit_prompt)
    question = format_question_prompt(feedback, doc)
    
    result = chain({
        "question": question,
    })

    return result["answer"]


def get_tone_change(doc):
    """Get the tone change for the document."""
    chain = get_qa_chain(qa_tone_prompt)
    
    result = chain({
        "question": doc,
    })

    return result["answer"]

def pipeline(doc):
    """Pipeline to run the chatbot."""
    feedback = get_review(doc)
    print(f"Review: {feedback}")
    save_text(feedback, "feedback.md")

    edits = get_edits(doc, feedback)
    print(f"Edits: {edits}")
    save_text(edits, "revised.md")

    tone_change = get_tone_change(edits)
    print(f"Tone change: {tone_change}")
    save_text(tone_change, "toned.md")

if __name__ == "__main__":
    # from draftSol import doc
    # from draftLiza import doc
    from draft import doc
    pipeline(doc)

