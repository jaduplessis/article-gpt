import os
import boto3
from src.loading.types import Config, FileConfig
from src.constants import SETTINGS

class Loader():
  """
  Loader class is used to load the file and provide the configuration for the file.
  """
  def __init__(self, file_name: str):
    self.s3 = boto3.client('s3')
    self.bucket_name = SETTINGS.bucket_name
    self.file_name = file_name
    self.file_config = self.config()
    self.file = self.load_file()

  def config(self) -> FileConfig:
    """Get the file configuration."""
    file_name = self.file_name

    file_path = f"input/{file_name}"

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
  

  def load_file(self) -> str:
    """Load the file from S3."""
    file_key = self.file_config.file_path
    response = self.s3.get_object(Bucket=self.bucket_name, Key=file_key)
    return response['Body'].read().decode('utf-8')


  def instantiate(self):
    return Config(
      file_name=self.file_name,
      file_config=self.file_config,
      file=self.file,
    )