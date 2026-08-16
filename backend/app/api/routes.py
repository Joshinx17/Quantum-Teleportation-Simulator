from fastapi import APIRouter

from app.models.quantum_models import TeleportRequest, TeleportResponse
from app.quantum.states import PRESETS, bloch, state_from_angles
from app.services.simulation_service import run_teleportation

router = APIRouter(prefix="/api")


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "engine": "qiskit-statevector"}


@router.get("/states/presets")
def presets() -> dict:
    return {"presets": list(PRESETS.values())}


@router.post("/quantum/teleport", response_model=TeleportResponse)
def teleport(request: TeleportRequest) -> dict:
    return run_teleportation(request.theta, request.phi, request.shots)


@router.post("/quantum/bloch")
def get_bloch(request: TeleportRequest) -> dict:
    return {"bloch": bloch(state_from_angles(request.theta, request.phi))}
