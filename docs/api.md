# API

- `GET /api/health` reports service status.
- `GET /api/states/presets` returns state presets.
- `POST /api/quantum/teleport` accepts `{theta, phi, shots}` and returns circuit text, sampled counts, states, measurement result, corrections, steps, and fidelity.
- `POST /api/quantum/bloch` returns Bloch coordinates for the requested state.

`theta` is in `[0, π]`, `phi` is in `[0, 2π]`, and shots is 100–10,000.
