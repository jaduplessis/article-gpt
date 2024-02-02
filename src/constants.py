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
    openai_model: str = "gpt-4"
    openai_model_test: str = "gpt-3.5-turbo"
    temperature: float = 0.8

    docs_url: List[str] = [
        'https://medium.com/serverless-transformation/building-a-robust-serverless-messaging-service-with-amazon-eventbridge-pipes-and-cdk-bf8250d10825',
        'https://medium.com/serverless-transformation/enabling-the-optimal-serverless-platform-team-cdk-and-team-topologies-fe4d9299adc9',
        'https://medium.com/serverless-transformation/lambda-dashboards-cdk-and-you-820f24a3d79c',
        'https://medium.com/serverless-transformation/building-a-massively-scalable-serverless-chat-application-with-aws-appsync-dbe1733dcb95',
        'https://medium.com/serverless-transformation/integration-testing-step-functions-using-sls-test-tools-31a20904a092',
        'https://medium.com/serverless-transformation/serverless-image-object-detection-at-a-social-media-startup-3691964be428',
    ]
    
    supabase_url: str
    supabase_service_key: SecretStr


SETTINGS = Settings()  # type: ignore
