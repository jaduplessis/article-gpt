from fastapi import FastAPI

from src.llm.article import ArticleGPT
from src.loading.document_loader import load_doc_route
from src.types import GetFileOutput, HealthRouteOutput, LoadDocumentsOutput, GetEditsOutput

app = FastAPI()

@app.get("/health")
def health_check_route() -> HealthRouteOutput:
    """Health check route to check that the API is up."""
    print("Health check route hit.")
    return HealthRouteOutput(status="maybe not ok")

@app.get("/dev/health")
def health_check_route() -> HealthRouteOutput:
    """Health check route to check that the API is up."""
    print("Health check route hit.")
    return HealthRouteOutput(status="definitely not ok")


@app.get("/load_docs")
def load_docs() -> LoadDocumentsOutput:
    """Route to load primary document of focus into vector store"""

    load_doc_route()
    return LoadDocumentsOutput(status="ok")


# @app.get("/get_edits/{file_name}")
# def get_edits(file_name: str) -> GetEditsOutput:
#     """Route to get edits for a given file."""
#     article = ArticleGPT(file_name=file_name) 
#     edits = article.get_edits()

#     return GetEditsOutput(status="ok", edits=edits)


@app.get("/get_file")
def get_file() -> HealthRouteOutput:
    """Route to get the file."""
    print("Get file route hit.")
    article = ArticleGPT(file_name='slackDraft.md')
    file = article.config.file

    return GetFileOutput(status="ok", file=file)


if __name__ == "__main__":
    article = ArticleGPT(file_name="slackDraft.md") 
    print(article.config.file)
    # article.get_edits()
    # print("Edits retrieved.")
    
    

