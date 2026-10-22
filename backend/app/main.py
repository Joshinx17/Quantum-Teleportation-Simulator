import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(title="Quantum Teleportation Lab", version="1.1.0")


def allowed_origins() -> list[str]:
    """Return local development plus explicitly configured public web origins."""
    configured = os.getenv("ALLOWED_ORIGINS", "")
    origins = ["http://localhost:5173"]
    origins.extend(origin.strip().rstrip("/") for origin in configured.split(",") if origin.strip())
    return list(dict.fromkeys(origins))


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
