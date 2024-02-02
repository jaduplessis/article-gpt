from pydantic import BaseModel


class FileConfig(BaseModel):
    file_name: str
    file_path: str
    project_dir: str
    output_dir: str
    version: str


class Config(BaseModel):
    file_name: str
    file_config: FileConfig
    file: str