from __future__ import annotations

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector


def teleportation_circuit(input_state: np.ndarray) -> QuantumCircuit:
    """Return the actual pre-measurement teleportation circuit used for simulation."""
    circuit = QuantumCircuit(3, 2, name="quantum_teleportation")
    circuit.initialize(input_state, 0)
    circuit.h(1)
    circuit.cx(1, 2)
    circuit.cx(0, 1)
    circuit.h(0)
    circuit.measure(0, 0)  # m0; Qiskit q0 is least-significant statevector bit
    circuit.measure(1, 1)  # m1
    return circuit


def _pre_measurement_state(input_state: np.ndarray) -> Statevector:
    circuit = QuantumCircuit(3)
    circuit.initialize(input_state, 0)
    circuit.h(1)
    circuit.cx(1, 2)
    circuit.cx(0, 1)
    circuit.h(0)
    return Statevector.from_instruction(circuit)


def bob_state_for_outcome(input_state: np.ndarray, m0: int, m1: int) -> np.ndarray:
    """Project Alice's q0/q1 measurement result then apply X if m1, Z if m0.

    Statevector indices use q2 q1 q0 bit order.  The returned state is normalized,
    and therefore independent of global phase.
    """
    vector = np.asarray(_pre_measurement_state(input_state).data)
    bob = np.array([vector[m0 + 2 * m1], vector[m0 + 2 * m1 + 4]], dtype=complex)
    bob /= np.linalg.norm(bob)
    if m1:
        bob = np.array([bob[1], bob[0]])
    if m0:
        bob = np.array([bob[0], -bob[1]])
    return bob


def fidelity(first: np.ndarray, second: np.ndarray) -> float:
    return float(abs(np.vdot(first, second)) ** 2)
