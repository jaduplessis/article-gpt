from llm.article import ArticleGPT  # Assuming this is the correct import based on your code structure


if __name__ == "__main__":
    article = ArticleGPT(file_name="slackDraft.md")
    
    edits = article.get_edits()
    
    

