import math
import numpy as np

from app.quantum.states import PRESETS, state_from_angles
from app.quantum.teleportation import bob_state_for_outcome, fidelity


def test_presets_teleport_for_every_measurement_outcome():
    for preset in PRESETS.values():
        initial = state_from_angles(preset["theta"], preset["phi"])
        for m0 in (0, 1):
            for m1 in (0, 1):
                assert fidelity(initial, bob_state_for_outcome(initial, m0, m1)) > 1 - 1e-10


def test_random_states_teleport():
    rng = np.random.default_rng(7)
    for _ in range(20):
        state = state_from_angles(float(rng.uniform(0, math.pi)), float(rng.uniform(0, 2 * math.pi)))
        assert fidelity(state, bob_state_for_outcome(state, 1, 1)) > 1 - 1e-10
