# Quantum teleportation

Alice starts with `|ψ⟩ = cos(θ/2)|0⟩ + exp(iφ)sin(θ/2)|1⟩`. Alice and Bob make a Bell pair with H(q1), CX(q1,q2). Alice applies CX(q0,q1), H(q0), then measures q0 and q1. Her two classical bits select Bob's X/Z correction. Alice's measurement destroys the original unknown state, satisfying the no-cloning principle. Entanglement does not permit faster-than-light signalling because Bob needs the classical bits.

For pure states this project calculates fidelity as `|⟨ψ|φ⟩|²`, which correctly treats globally phased vectors as identical physical states.
