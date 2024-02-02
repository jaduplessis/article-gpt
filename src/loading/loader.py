import os

from loading.types import Config, FileConfig


class Loader():
  """
  Loader class is used to load the file and provide the configuration for the file.
  """
  def __init__(self, file_name: str, test: bool = False):
    self.file_name = file_name
    self.file_config = self.config()
    self.file = self.load_file(test)

  def config(self) -> FileConfig:
    """Get the file configuration."""
    file_name = self.file_name

    file_path = f"src/input/{file_name}"
    if not os.path.exists(file_path):
      raise FileNotFoundError("File does not exist.")

    if not file_name.endswith(".md"):
      raise TypeError("File must be a markdown file.")
    else:
      project = file_name.split(".")[-2]

    project_dir = f"src/output/{project}"
    if not os.path.exists(project_dir):
      os.makedirs(project_dir)


    versions = os.listdir(project_dir)
    # If most recent version is empty, use it. Otherwise, create a new version.
    if versions and not os.listdir(f"{project_dir}/{versions[-1]}"):
      version = versions[-1]
      output_dir = f"{project_dir}/{version}"
    else:
      version = f"v{len(versions) + 1}"
      output_dir = f"{project_dir}/{version}"
      os.makedirs(output_dir)
      
    return FileConfig(
      file_name=file_name,
      file_path=file_path,
      output_dir=output_dir,
      project_dir=project_dir,
      version=version,
    )
  

  def load_file(self, test) -> str:
    """Load the file."""
    with open(self.file_config.file_path, "r", encoding="utf-8") as file:
      if test:
        return file.read()[:500]
      else:
        return file.read()


  def instantiate(self):
    return Config(
      file_name=self.file_name,
      file_config=self.file_config,
      file=self.file,
    )