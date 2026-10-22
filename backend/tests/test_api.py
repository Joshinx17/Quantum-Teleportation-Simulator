from fastapi.testclient import TestClient
from app.main import app
from app.main import allowed_origins

client = TestClient(app)


def test_health_and_teleport():
    assert client.get("/api/health").json()["status"] == "ok"
    response = client.post("/api/quantum/teleport", json={"theta": 1.570796, "phi": 0, "shots": 100})
    assert response.status_code == 200
    assert response.json()["fidelity"] > 0.999999


def test_rejects_invalid_shots():
    assert client.post("/api/quantum/teleport", json={"theta": 0, "phi": 0, "shots": 3}).status_code == 422


def test_allowed_origins_keeps_localhost_and_reads_production_origins(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "https://lab.vercel.app, https://preview.vercel.app/")
    assert allowed_origins() == [
        "http://localhost:5173",
        "https://lab.vercel.app",
        "https://preview.vercel.app",
    ]
