from pydantic import BaseModel


class FileConfig(BaseModel):
    """Configuration for the file."""
    file_name: str
    file_path: str
    project_dir: str
    output_dir: str
    version: str


class Config(BaseModel):
    """Configuration for the ArticleGPT class."""
    file_name: str
    file_config: FileConfig
    file: str