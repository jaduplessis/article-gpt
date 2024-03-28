"""Set up some constants for the project."""
from typing import List

from pydantic import SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings for the demo app.

    Reads from environment variables.
    You can create the .env file from the .env_example file.

    !!! SecretStr is a pydantic type that hides the value in logs.
    If you want to use the real value, you should do:
    SETTINGS.<variable>.get_secret_value()
    """

    class Config:
        env_file = ".env"

    openai_api_key: SecretStr


SETTINGS = Settings()  # type: ignore
