import { useState } from 'react';
import './App.css';
import ParamForm, { getDefaults } from './components/ParamForm';
import KPICards from './components/KPICards';
import Charts from './components/Charts';
import DataTable from './components/DataTable';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function PathwayDiagram() {
  return (
    <div className="pathway">
      <svg viewBox="0 0 820 180" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: 780 }}>
        <rect x="5" y="10" width="460" height="160" rx="10" fill="rgba(45,212,191,0.06)" stroke="rgba(45,212,191,0.15)" />
        <rect x="490" y="10" width="325" height="160" rx="10" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.15)" />
        <text x="230" y="32" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif">PLANT TISSUE</text>
        <text x="652" y="32" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif">B. SUBTILIS (ACCD)</text>
        <rect x="25" y="55" width="75" height="34" rx="6" fill="#1a2233" stroke="#f87171" strokeWidth="1.5" />
        <text x="62" y="76" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">Stress</text>
        <rect x="130" y="55" width="60" height="34" rx="6" fill="#1a2233" stroke="#94a3b8" />
        <text x="160" y="76" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="500" fontFamily="Inter,sans-serif">SAM</text>
        <line x1="100" y1="72" x2="128" y2="72" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="220" y="55" width="65" height="34" rx="6" fill="#1a2233" stroke="#2dd4bf" strokeWidth="1.5" />
        <text x="252" y="76" textAnchor="middle" fill="#2dd4bf" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">ACC</text>
        <text x="207" y="50" fill="#64748b" fontSize="9" fontFamily="Inter,sans-serif">ACS</text>
        <line x1="190" y1="72" x2="218" y2="72" stroke="#2dd4bf" strokeWidth="1.5" markerEnd="url(#arrowTeal)" />
        <rect x="340" y="55" width="100" height="34" rx="6" fill="#1a2233" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="390" y="76" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">Ethylene</text>
        <text x="310" y="50" fill="#64748b" fontSize="9" fontFamily="Inter,sans-serif">ACO</text>
        <line x1="285" y1="72" x2="338" y2="72" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowYellow)" />
        <path d="M 390 90 Q 390 140 62 140 Q 30 140 30 100 L 30 90" fill="none" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arrowRed)" />
        <text x="200" y="155" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="Inter,sans-serif">growth inhibition / senescence</text>
        <line x1="252" y1="90" x2="252" y2="120" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="270" y="108" fill="#64748b" fontSize="9" fontFamily="Inter,sans-serif">export</text>
        <rect x="220" y="120" width="90" height="34" rx="6" fill="#1a2233" stroke="#2dd4bf" />
        <text x="265" y="141" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="500" fontFamily="Inter,sans-serif">ACC (root)</text>
        <line x1="310" y1="137" x2="500" y2="80" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
        <rect x="505" y="55" width="80" height="34" rx="6" fill="#1a2233" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="545" y="76" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">ACCD</text>
        <rect x="625" y="48" width="170" height="20" rx="5" fill="rgba(52,211,153,0.1)" stroke="#34d399" />
        <text x="710" y="62" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="500" fontFamily="Inter,sans-serif">a-ketobutyrate + NH3</text>
        <line x1="585" y1="68" x2="623" y2="60" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arrowGreen)" />
        <rect x="560" y="110" width="140" height="30" rx="5" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" />
        <text x="630" y="129" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter,sans-serif">Bacterial Growth</text>
        <line x1="630" y1="90" x2="630" y2="108" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arrowBlue)" />
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker>
          <marker id="arrowTeal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" /></marker>
          <marker id="arrowYellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" /></marker>
          <marker id="arrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" /></marker>
          <marker id="arrowBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" /></marker>
          <marker id="arrowGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" /></marker>
        </defs>
      </svg>
      <p className="pathway-label">Figure 1. ACC-only pathway: Plant stress induces ACC accumulation; ACCD in B. subtilis consumes root-zone ACC, reducing ethylene.</p>
    </div>
  );
}

function EquationPanel() {
  return (
    <div className="eq-panel">
      <div><span className="eq-label">Eq 1</span> dA<sub>p</sub>/dt = V<sub>ACS,max</sub> &middot; f<sub>stress</sub> &minus; k<sub>ACO</sub> &middot; A<sub>p</sub> &minus; k<sub>exp</sub> &middot; A<sub>p</sub></div>
      <div><span className="eq-label">Eq 2</span> dA<sub>r</sub>/dt = k<sub>exp</sub> &middot; A<sub>p</sub> &middot; (V<sub>p</sub>/V<sub>r</sub>) &minus; V<sub>max</sub><sup>ACCD</sup> &middot; A<sub>r</sub>/(K<sub>m</sub>+A<sub>r</sub>) &middot; X<sub>b</sub> &minus; k<sub>loss</sub> &middot; A<sub>r</sub></div>
      <div><span className="eq-label">Eq 3</span> dC<sub>E</sub>/dt = Y<sub>E</sub> &middot; k<sub>ACO</sub> &middot; A<sub>p</sub> &middot; (V<sub>p</sub>/V<sub>air</sub>) &minus; k<sub>vent</sub> &middot; C<sub>E</sub> &minus; k<sub>scrub</sub> &middot; C<sub>E</sub></div>
      <div><span className="eq-label">Eq 4</span> dX<sub>b</sub>/dt = &mu;<sub>max</sub> &middot; A<sub>r</sub>/(K<sub>s</sub>+A<sub>r</sub>) &middot; X<sub>b</sub> &minus; k<sub>d</sub> &middot; X<sub>b</sub></div>
      <div><span className="eq-label">Eq 5</span> dG/dt = r<sub>g</sub> &middot; [1 &minus; C<sub>E</sub><sup>n</sup>/(K<sub>E</sub><sup>n</sup> + C<sub>E</sub><sup>n</sup>)] &middot; G</div>
    </div>
  );
}

export default function App() {
  const [params, setParams] = useState(getDefaults());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Simulation failed');
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setParams(getDefaults());
    setResult(null);
    setError(null);
  };

  return (
    <>
      <header className="hero">
        <h1>ACC-Ethylene-ACCD Mathematical Model</h1>
        <p className="sub">
          Interactive ODE simulation of how ACC deaminase-expressing <em>B. subtilis</em> reduces plant ethylene via root-zone ACC consumption
        </p>
        <span className="badge">iGEM 2026 &middot; Computational Modeling</span>
      </header>

      <div className="container">
        <PathwayDiagram />
        <EquationPanel />

        <ParamForm
          params={params}
          onChange={setParams}
          onRun={handleRun}
          onReset={handleReset}
          loading={loading}
        />

        {error && <div className="error-box">Error: {error}</div>}

        {loading && (
          <div className="loading-overlay">
            <span className="spinner" /> Running ODE solver...
          </div>
        )}

        {result && (
          <>
            <KPICards kpis={result.kpis} />
            <Charts timeSeries={result.timeSeries} />
            <DataTable timeSeries={result.timeSeries} params={result.params} />
          </>
        )}
      </div>
    </>
  );
}
