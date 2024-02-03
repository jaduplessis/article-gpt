"""Tests for `api/main.py`."""
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_check_route() -> None:
    response = client.get("/health")
    assert response.status_code == 200

