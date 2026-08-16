# Quantum Teleportation Lab

An interactive, full-stack educational simulator for the three-qubit quantum teleportation protocol. It uses a real Qiskit circuit and statevector simulation—not a visual mock-up—to reconstruct an arbitrary qubit state on Bob's qubit.

## Features

- Six common qubit presets plus arbitrary θ/φ Bloch-sphere input
- Qiskit-generated circuit, sampled Bell-measurement statistics, and explicit classical communication
- Fidelity comparison that handles global phase correctly
- Interactive Bloch comparison, guided execution, error/loading states, responsive dark scientific UI
- FastAPI/Pydantic API, unit/API tests, Docker Compose configuration

## Architecture

React + TypeScript communicates with FastAPI. The backend separates HTTP routes, Pydantic contracts, and Qiskit quantum logic. See [architecture](docs/architecture.md), [protocol notes](docs/quantum-teleportation.md), and [API reference](docs/api.md).

## Run locally

Backend (Python 3.11+ recommended):

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Set `VITE_API_URL` for a deployed API; see `.env.example`.

## Tests and build

```bash
cd backend && python -m pytest tests -q
cd frontend && npm run build
```

## Docker

```bash
docker compose up --build
```

Then open `http://localhost:5173`.

## Deployment and roadmap

Deploy the frontend to Vercel with `VITE_API_URL` set to your HTTPS API. Deploy the backend on any Python container host. Future extensions include Qiskit Aer/noise models, IBM hardware execution, error correction, and additional algorithms.
