# Quantum Teleportation Lab

[![Verify](https://github.com/<owner>/<repository>/actions/workflows/verify.yml/badge.svg)](https://github.com/<owner>/<repository>/actions/workflows/verify.yml)

> **[Open the live demo](https://<project>.vercel.app)** · Will Update this link after the first Vercel deployment.

An interactive, full-stack introduction to quantum teleportation. Choose an arbitrary qubit, run the actual three-qubit Qiskit protocol, then follow Alice's measurement, the classical message, and Bob's reconstruction step by step.

## Highlights

- Guided animated circuit walkthrough with play, pause, reset, and keyboard-accessible stage controls
- Qiskit statevector simulation with sampled Bell-measurement outcomes and global-phase-invariant fidelity
- Bloch-sphere input/output comparison, preset states, and arbitrary θ/φ controls
- Responsive scientific UI with reduced-motion support and clear hosted-service retry feedback
- GitHub Actions verification plus Vercel + Render deployment configuration

## Architecture

```
Browser → Vercel (React + TypeScript) → Render (FastAPI + Qiskit)
```

The browser loads a static Vite build from Vercel. It calls the public Render API for a simulation result; the frontend then animates the educational walkthrough locally from that result. The simulator is ideal and deterministic apart from sampled measurement outcomes—it is not quantum hardware.

## Run locally

Backend (Python 3.11+):

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

Open http://localhost:5173. The default frontend API URL is http://localhost:8000/api.

### Windows: virtual environment moved or broken

Python virtual environments contain absolute paths. If the repository is moved, recreate the backend environment rather than reusing it:

```powershell
cd "D:\path\to\Quantum-Teleportation-Simulator\backend"
Remove-Item -Recurse -Force .\venv
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Using `python -m pip` and `python -m uvicorn` prevents stale `pip.exe` or `uvicorn.exe` launcher paths. If activation is blocked, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` for the current PowerShell session.

## Deploy publicly

### 1. Push this repository to GitHub

Keep the default branch named `main`. GitHub Actions runs the frontend and backend checks for every pull request and main-branch push.

### 2. Deploy the API on Render

1. In Render, choose **New → Blueprint** and select this repository.
2. Render reads [render.yaml](render.yaml), builds from `backend/`, and exposes `/api/health`.
3. Set `ALLOWED_ORIGINS` to your final Vercel domain, for example `https://quantum-teleportation-lab.vercel.app`.
4. Copy the Render URL and append `/api`, for example `https://quantum-teleportation-api.onrender.com/api`.

### 3. Deploy the site on Vercel

1. Import the GitHub repository in Vercel.
2. Set **Root Directory** to `frontend`; Vercel reads [frontend/vercel.json](frontend/vercel.json).
3. Add the `VITE_API_URL` environment variable using the Render API URL from step 2.
4. Deploy. Every push to `main` now creates the public production site; pull requests create previews.

Open the Vercel URL directly to use the full simulator. If Render's free instance is waking up, the site presents a retry action instead of failing the experience.

### Optional custom domain

Add the domain in Vercel, then update Render's `ALLOWED_ORIGINS` with the exact HTTPS domain.

## Verification

```bash
cd backend && python -m pytest tests -q
cd frontend && npm run test && npm run build
```

See [architecture](docs/architecture.md), [protocol notes](docs/quantum-teleportation.md), and the [API reference](docs/api.md).
