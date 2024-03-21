from src_old.llm.qa_chain import get_qa_chain
from src_old.loading.loader import Loader
from src_old.prompts.edits import create_edits_prompt
from src_old.prompts.feedback import create_feedback_prompt


class ArticleGPT():
  """
  ArticleGPT class is used to review and edit draft technical articles. 
  It can be provided context from exemplary gold standard articles to compare with, allowing it to provide more relevant feedback.
  
  """
  def __init__(self, file_name: str, save: bool = True, test: bool = False):
    self.config = Loader(file_name).instantiate()
    self.save = save
    self.test = test

  def get_feedback(self):
    """Get the feedback for the document."""
    qa_chain = get_qa_chain(self.test)
    feedback_prompt = create_feedback_prompt(self.config.file)

    feedback = qa_chain({
      "question": feedback_prompt,
    })

    self.feedback = feedback["answer"]
    return feedback["answer"]


  def get_edits(self):
    """Get the edits for the document based on the feedback."""
    feedback = self.get_feedback()

    qa_chain = get_qa_chain(self.test)

    edits_prompt = create_edits_prompt(feedback, self.config.file)

    edits = qa_chain({
      "question": edits_prompt,
    })

    self.edits = edits["answer"]

    if self.save:
      self.save_outputs()
      
    return edits["answer"]
  

  def get_headers(self):
    # TODO: Implement this method
    """Get the headers for the document."""
    pass


  def save_outputs(self):
    """Save the outputs to the output directory."""
    with open(f"{self.config.file_config.output_dir}/feedback.md", "w", encoding="utf-8") as file:
      file.write(self.feedback)

    with open(f"{self.config.file_config.output_dir}/edits.md", "w", encoding="utf-8") as file:
      file.write(self.edits)