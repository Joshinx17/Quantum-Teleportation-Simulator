import { describe, expect, it } from 'vitest'
import { stateFromAngles } from './state'

describe('stateFromAngles', () => {
  it('prepares the plus state on the X axis', () => {
    const state = stateFromAngles(Math.PI / 2, 0)
    expect(state.probabilities['0']).toBeCloseTo(0.5)
    expect(state.probabilities['1']).toBeCloseTo(0.5)
    expect(state.bloch.x).toBeCloseTo(1)
  })
})
