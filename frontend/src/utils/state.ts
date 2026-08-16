import type { State } from '../types/quantum'

export function stateFromAngles(theta: number, phi: number): State {
  return {
    alpha: { real: Math.cos(theta / 2), imaginary: 0, display: '' },
    beta: { real: Math.cos(phi) * Math.sin(theta / 2), imaginary: Math.sin(phi) * Math.sin(theta / 2), display: '' },
    probabilities: { '0': Math.cos(theta / 2) ** 2, '1': Math.sin(theta / 2) ** 2 },
    bloch: { x: Math.sin(theta) * Math.cos(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(theta) },
  }
}
