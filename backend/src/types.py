from pydantic import BaseModel

class HealthRouteOutput(BaseModel):
    """Model for the health route output."""

    status: str


class LoadDocumentsOutput(BaseModel):
    """Model for the load documents route output."""

    status: str


class GetEditsOutput(BaseModel):
    """Model for the get edits route output."""

    status: str
    edits: str


class GetFileOutput(BaseModel):
    """Model for the get file route output."""

    status: str
    file: str