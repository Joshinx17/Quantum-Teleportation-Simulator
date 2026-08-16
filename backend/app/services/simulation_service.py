from __future__ import annotations

import numpy as np

from app.quantum.states import bloch, state_from_angles
from app.quantum.teleportation import bob_state_for_outcome, fidelity, teleportation_circuit


def _complex(value: complex) -> dict[str, float | str]:
    return {"real": round(float(value.real), 8), "imaginary": round(float(value.imag), 8), "display": f"{value.real:.4f} {value.imag:+.4f}i"}


def _state_payload(state: np.ndarray) -> dict:
    return {"alpha": _complex(state[0]), "beta": _complex(state[1]), "probabilities": {"0": round(float(abs(state[0]) ** 2), 8), "1": round(float(abs(state[1]) ** 2), 8)}, "bloch": bloch(state)}


STEPS = [
    ("1. Prepare Alice's qubit", "Alice encodes the selected unknown state |ψ⟩ on q0."),
    ("2. Create a Bell pair", "H then CX entangle Alice's q1 with Bob's q2."),
    ("3. Bell interaction", "CX(q0,q1) transfers correlations into the Bell basis."),
    ("4. Hadamard transform", "H(q0) completes Alice's Bell-state measurement basis."),
    ("5. Measure Alice", "Measuring q0 and q1 yields two random classical bits m0 and m1."),
    ("6. Classical channel", "Alice sends those two ordinary bits to Bob; this cannot be faster than light."),
    ("7. Bob corrects", "Bob applies X when m1=1 and Z when m0=1 to reconstruct |ψ⟩."),
    ("8. Compare states", "The fidelity ignores global phase and is 1 for an ideal simulation."),
]


def run_teleportation(theta: float, phi: float, shots: int) -> dict:
    input_state = state_from_angles(theta, phi)
    # Every Bell outcome has probability 1/4; sampling represents actual repeated measurements.
    outcomes = np.random.default_rng().choice(4, size=shots)
    counts = {format(index, "02b"): int(np.sum(outcomes == index)) for index in range(4)}
    chosen = int(outcomes[0])
    m1, m0 = (chosen >> 1) & 1, chosen & 1
    output_state = bob_state_for_outcome(input_state, m0=m0, m1=m1)
    correction = ([] if not m1 else ["X(q2)"]) + ([] if not m0 else ["Z(q2)"])
    circuit = teleportation_circuit(input_state)
    return {
        "input_state": _state_payload(input_state),
        "bob_state": _state_payload(output_state),
        "measurement": {"alice_bits": f"{m1}{m0}", "bit_order": "m1m0 (q1q0)"},
        "counts": counts,
        "fidelity": round(fidelity(input_state, output_state), 12),
        "corrections": correction or ["I (no correction)"],
        "circuit": str(circuit.draw(output="text")),
        "steps": [{"title": title, "explanation": explanation} for title, explanation in STEPS],
    }
