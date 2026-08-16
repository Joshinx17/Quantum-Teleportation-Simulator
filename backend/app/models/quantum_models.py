from __future__ import annotations

from pydantic import BaseModel, Field


class TeleportRequest(BaseModel):
    theta: float = Field(ge=0.0, le=3.141592653589793)
    phi: float = Field(ge=0.0, le=6.283185307179586)
    shots: int = Field(default=1000, ge=100, le=10000)


class ComplexValue(BaseModel):
    real: float
    imaginary: float
    display: str


class QubitState(BaseModel):
    alpha: ComplexValue
    beta: ComplexValue
    probabilities: dict[str, float]
    bloch: dict[str, float]


class TeleportResponse(BaseModel):
    input_state: QubitState
    bob_state: QubitState
    measurement: dict[str, str]
    counts: dict[str, int]
    fidelity: float
    corrections: list[str]
    circuit: str
    steps: list[dict[str, str]]
