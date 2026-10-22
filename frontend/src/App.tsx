import { useEffect, useMemo, useState } from 'react'
import { teleport } from './services/api'
import type { Result, State } from './types/quantum'
import { stateFromAngles } from './utils/state'

const PI = Math.PI
const presets = [['|0⟩', 0, 0], ['|1⟩', PI, 0], ['|+⟩', PI / 2, 0], ['|−⟩', PI / 2, PI], ['|+i⟩', PI / 2, PI / 2], ['|−i⟩', PI / 2, PI * 1.5]] as const
const stages = [
  { short: 'Prepare', gate: '|ψ⟩', lane: 0 }, { short: 'Entangle', gate: 'H · CX', lane: 1 }, { short: 'Bell basis', gate: 'CX', lane: 0 }, { short: 'Rotate', gate: 'H', lane: 0 },
  { short: 'Measure', gate: 'M', lane: 0 }, { short: 'Send bits', gate: 'm₁m₀', lane: 2 }, { short: 'Correct', gate: 'X / Z', lane: 2 }, { short: 'Verify', gate: 'F', lane: 2 },
]

function Sphere({ input, output }: { input: State; output?: State }) {
  const point = (state: State, color: string, label: string) => {
    const x = 150 + state.bloch.x * 76 + state.bloch.y * 22
    const y = 150 - state.bloch.z * 82 + state.bloch.y * 12
    return <g><line x1="150" y1="150" x2={x} y2={y} stroke={color} strokeWidth="4" /><circle cx={x} cy={y} r="7" fill={color} /><title>{label}</title></g>
  }
  return <svg className="sphere" viewBox="0 0 300 300" role="img" aria-label="Bloch sphere comparison"><defs><radialGradient id="orb"><stop stopColor="#20395d" /><stop offset="1" stopColor="#0c1422" /></radialGradient></defs><circle cx="150" cy="150" r="108" fill="url(#orb)" stroke="#60718a" /><ellipse cx="150" cy="150" rx="108" ry="34" fill="none" stroke="#41526c" /><path d="M74 74 L226 226 M226 74 L74 226" stroke="#30415a" /><line x1="42" y1="150" x2="258" y2="150" stroke="#41526c" /><line x1="150" y1="42" x2="150" y2="258" stroke="#53657c" /><text x="158" y="54">|0⟩</text><text x="158" y="252">|1⟩</text><text x="258" y="145">X</text><text x="73" y="82">Y</text>{point(input, '#8cf2ce', 'Alice input state')}{output && point(output, '#a8b9ff', 'Bob reconstructed state')}</svg>
}

function StateDetails({ state, title }: { state: State; title: string }) {
  return <div className="state-detail"><h3>{title}</h3><p className="formula">|ψ⟩ = {state.alpha.display || state.alpha.real.toFixed(3)}|0⟩ + ({state.beta.real.toFixed(3)} {state.beta.imaginary >= 0 ? '+' : '−'} {Math.abs(state.beta.imaginary).toFixed(3)}i)|1⟩</p><div className="metrics"><span>P(0) <b>{(state.probabilities['0'] * 100).toFixed(1)}%</b></span><span>P(1) <b>{(state.probabilities['1'] * 100).toFixed(1)}%</b></span></div></div>
}

function Circuit({ active }: { active: number }) {
  return <div className="circuit-board" aria-label="Teleportation circuit, current stage highlighted"><div className="wire-labels"><span>q0 · Alice input</span><span>q1 · Alice share</span><span>q2 · Bob share</span></div><div className="wires">{[0, 1, 2].map(lane => <i key={lane} style={{ top: `${25 + lane * 50}px` }} />)}</div><div className="gates">{stages.map((stage, index) => <div key={stage.short} className={`gate ${index === active ? 'active' : ''} lane-${stage.lane}`} aria-current={index === active ? 'step' : undefined}><b>{stage.gate}</b><span>{stage.short}</span></div>)}</div></div>
}

function App() {
  const [theta, setTheta] = useState(PI / 2), [phi, setPhi] = useState(0), [shots, setShots] = useState(1000)
  const [result, setResult] = useState<Result | null>(null), [error, setError] = useState(''), [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0), [guided, setGuided] = useState(false), [playing, setPlaying] = useState(false)
  const input = useMemo(() => stateFromAngles(theta, phi), [theta, phi])
  const currentSteps = result?.steps ?? []
  useEffect(() => {
    if (!playing || !result) return
    const timer = window.setInterval(() => setStep(value => { if (value >= stages.length - 1) { setPlaying(false); return value }; return value + 1 }), 1600)
    return () => window.clearInterval(timer)
  }, [playing, result])
  const run = async (startGuided = false) => {
    setLoading(true); setError(''); setResult(null); setStep(0); setPlaying(false)
    try { setResult(await teleport(theta, phi, shots)); setGuided(startGuided); setPlaying(startGuided) }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'The simulation service is unavailable.') }
    finally { setLoading(false) }
  }
  const startGuide = () => { if (result) { setGuided(true); setStep(0); setPlaying(true) } else void run(true) }
  const selectedStage = currentSteps[step]
  return <main>
    <nav><a className="brand" href="#top">QTL <span>Quantum Teleportation Lab</span></a><div><a href="#simulator">Simulator</a><a href="#walkthrough">Walkthrough</a><a href="#learn">Learn</a></div></nav>
    <header id="top"><p className="eyebrow">QUANTUM COMPUTING LABORATORY / 01</p><h1>Teleport a <em>quantum state.</em><br />Not the particle.</h1><p className="lede">A hands-on, Qiskit-powered introduction to the three-qubit teleportation protocol. Set a state, follow the circuit, and watch Bob reconstruct it.</p><a className="hero-link" href="#simulator">Explore the experiment <span>↓</span></a></header>
    <section id="simulator" className="grid intro-grid"><article className="panel controls"><p className="eyebrow">01 / STATE PREPARATION</p><h2>Select Alice’s qubit</h2><div className="presets">{presets.map(([name, t, p]) => <button key={name} className={theta === t && phi === p ? 'selected' : ''} onClick={() => { setTheta(t); setPhi(p) }}>{name}</button>)}</div><label>Polar angle θ <output>{theta.toFixed(3)} rad</output><input aria-label="Polar angle theta" type="range" min="0" max={PI} step="0.01" value={theta} onChange={event => setTheta(+event.target.value)} /></label><label>Phase angle φ <output>{phi.toFixed(3)} rad</output><input aria-label="Phase angle phi" type="range" min="0" max={PI * 2} step="0.01" value={phi} onChange={event => setPhi(+event.target.value)} /></label><StateDetails title="Input amplitudes" state={input} /></article><article className="panel sphere-panel"><p className="eyebrow">BLOCH COORDINATES</p><Sphere input={input} output={result?.bob_state} /><div className="legend"><i className="mint" /> Alice input <i className="lavender" /> Bob output</div><p className="coordinate">({input.bloch.x.toFixed(2)}, {input.bloch.y.toFixed(2)}, {input.bloch.z.toFixed(2)})</p></article></section>
    <section className="panel protocol"><div><p className="eyebrow">02 / EXPERIMENT</p><h2>Run the real protocol</h2><p>Qiskit creates the Bell pair, samples Alice’s measurement, and reconstructs the state on Bob’s qubit.</p></div><div className="actions"><select value={shots} onChange={event => setShots(+event.target.value)} aria-label="Measurement shots"><option value="100">100 shots</option><option value="1000">1,000 shots</option><option value="10000">10,000 shots</option></select><button className="run" onClick={() => void run()} disabled={loading}>{loading ? 'Contacting Qiskit…' : 'Run simulation'}</button><button className="secondary" onClick={startGuide} disabled={loading}>Guided walkthrough</button></div>{error && <div role="alert" className="error"><strong>Simulation service unavailable.</strong><span>The hosted quantum engine may be waking up. Please wait a moment and try again.</span><button className="secondary" onClick={() => void run(guided)}>Retry simulation</button></div>}{result && <details className="circuit-text"><summary>View Qiskit circuit output</summary><pre>{result.circuit}</pre></details>}</section>
    {result && <><section id="walkthrough" className="panel walkthrough"><div className="walk-head"><div><p className="eyebrow">03 / GUIDED EXECUTION</p><h2>Follow the information flow</h2></div><div className="player"><button className="secondary" onClick={() => { setGuided(true); setStep(0); setPlaying(false) }}>Reset</button><button className="run" onClick={() => setPlaying(value => !value)}>{playing ? 'Pause' : step === stages.length - 1 ? 'Replay' : 'Play walkthrough'}</button></div></div><Circuit active={step} /><div className="step-list">{currentSteps.map((item, index) => <button className={index === step ? 'active' : ''} key={item.title} onClick={() => { setGuided(true); setPlaying(false); setStep(index) }} aria-label={`Step ${index + 1}: ${item.title}`}><b>{String(index + 1).padStart(2, '0')}</b><span>{stages[index]?.short}</span></button>)}</div>{selectedStage && <div className="explanation" aria-live="polite"><p className="eyebrow">NOW HAPPENING</p><h3>{selectedStage.title}</h3><p>{selectedStage.explanation}</p>{step === 5 && <p className="bit-callout">Alice sends <b>{result.measurement.alice_bits}</b> across the classical channel.</p>}{step === 6 && <p className="bit-callout">Bob applies: <b>{result.corrections.join(' then ')}</b></p>}</div>}</section>
      <section className="grid results"><article className="panel"><p className="eyebrow">04 / CLASSICAL CHANNEL</p><div className="channel"><strong>Alice</strong><span>m₁m₀ = <b>{result.measurement.alice_bits}</b> → → →</span><strong>Bob</strong></div><p>Two ordinary bits cross the channel. No matter or quantum state travels, and Bob cannot reconstruct the state until they arrive.</p><p className="formula">Corrections: {result.corrections.join(' then ')}</p></article><article className="panel fidelity"><p className="eyebrow">05 / VERIFICATION</p><h2>{result.fidelity.toFixed(8)}</h2><p>Teleportation fidelity</p><div className="fidelity-bar"><i style={{ width: `${result.fidelity * 100}%` }} /></div><small>F = |⟨ψin|ψBob⟩|² — global-phase invariant</small></article></section>
      <section className="grid results"><article className="panel"><StateDetails title="Alice’s original state" state={result.input_state} /><StateDetails title="Bob’s reconstructed state" state={result.bob_state} /></article><article className="panel"><p className="eyebrow">MEASUREMENT DISTRIBUTION</p>{Object.entries(result.counts).map(([key, value]) => <div className="count" key={key}><span>{key}</span><i><b style={{ width: `${value / shots * 100}%` }} /></i><span>{value} / {shots}</span></div>)}<small>Every Bell outcome is random; each branch reconstructs the same final qubit after correction.</small></article></section></>}
    <section id="learn" className="learn"><p className="eyebrow">HOW IT WORKS</p><h2>Quantum teleportation, demystified.</h2><details open><summary>What is actually teleported?</summary><p>Information describing a quantum state—not a particle. Alice’s original state is destroyed by her measurement, so the protocol does not copy an unknown qubit.</p></details><details><summary>Why entanglement?</summary><p>The Bell pair gives Alice and Bob correlations that make reconstruction possible after Alice sends her two measurement bits.</p></details><details><summary>Is this a real quantum computer?</summary><p>This lab uses Qiskit’s ideal statevector simulator: a precise educational model without hardware noise. Real devices add noise, limited connectivity, and queue time.</p></details></section>
    <footer>Quantum Teleportation Lab · React + TypeScript · FastAPI + Qiskit · Educational open source experiment</footer>
  </main>
}
export default App
