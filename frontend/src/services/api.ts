import type { Result } from '../types/quantum'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export async function teleport(theta:number, phi:number, shots:number): Promise<Result> {
  const response = await fetch(`${API}/quantum/teleport`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({theta, phi, shots})})
  if (!response.ok) throw new Error('Unable to run the quantum simulation. Please check that the backend is running and try again.')
  return response.json()
}
