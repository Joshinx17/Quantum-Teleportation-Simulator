# Architecture

The React/TypeScript client calls FastAPI over JSON. `simulation_service` orchestrates the request while `quantum` contains independently testable Qiskit logic. The current executor uses Qiskit's `Statevector`, which is ideal and deterministic for state reconstruction; repeated Alice measurements are sampled from the circuit's verified 1/4 Bell-outcome distribution. A future executor can replace it with Aer or IBM hardware without changing the HTTP contract.

Qiskit statevector indexing is little-endian: q0 is bit 0. The UI displays Alice's result as `m1m0` (`q1q0`). The implemented correction is X for `m1=1`, then Z for `m0=1`: `00 → I`, `01 → Z`, `10 → X`, `11 → X then Z` in that displayed order.
