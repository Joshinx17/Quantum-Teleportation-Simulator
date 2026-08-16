from __future__ import annotations

import cmath
import math
import numpy as np


PRESETS = {
    "zero": {"label": "|0⟩", "theta": 0.0, "phi": 0.0},
    "one": {"label": "|1⟩", "theta": math.pi, "phi": 0.0},
    "plus": {"label": "|+⟩", "theta": math.pi / 2, "phi": 0.0},
    "minus": {"label": "|−⟩", "theta": math.pi / 2, "phi": math.pi},
    "plus_i": {"label": "|+i⟩", "theta": math.pi / 2, "phi": math.pi / 2},
    "minus_i": {"label": "|−i⟩", "theta": math.pi / 2, "phi": 3 * math.pi / 2},
}


def state_from_angles(theta: float, phi: float) -> np.ndarray:
    return np.array([math.cos(theta / 2), cmath.exp(1j * phi) * math.sin(theta / 2)], dtype=complex)


def bloch(state: np.ndarray) -> dict[str, float]:
    alpha, beta = state
    return {
        "x": float(2 * (alpha.conjugate() * beta).real),
        "y": float(2 * (alpha.conjugate() * beta).imag),
        "z": float(abs(alpha) ** 2 - abs(beta) ** 2),
    }
