export type ComplexValue = { real: number; imaginary: number; display: string }
export type State = { alpha: ComplexValue; beta: ComplexValue; probabilities: Record<string, number>; bloch: { x: number; y: number; z: number } }
export type Result = { input_state: State; bob_state: State; measurement: { alice_bits: string; bit_order: string }; counts: Record<string, number>; fidelity: number; corrections: string[]; circuit: string; steps: {title:string; explanation:string}[] }
