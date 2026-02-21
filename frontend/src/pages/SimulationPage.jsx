import { useState } from 'react';
import ParamForm, { getDefaults } from '../components/ParamForm';
import KPICards from '../components/KPICards';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function SimulationPage() {
    const [params, setParams] = useState(getDefaults());
    const [mode, setMode] = useState('baseline');
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
                body: JSON.stringify({ ...params, mode }),
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
        setMode('baseline');
        setResult(null);
        setError(null);
    };

    return (
        <div className="page-simulation">
            <header className="page-header">
                <h1 className="page-title">
                    <span className="page-title-icon">🔬</span>
                    Simulation
                </h1>
                <p className="page-subtitle">
                    Configure parameters, select a mode preset, and run the ODE solver to compare Control vs. ACCD-inoculated scenarios.
                </p>
            </header>
            <div className="container">
                <ParamForm
                    params={params}
                    onChange={setParams}
                    onRun={handleRun}
                    onReset={handleReset}
                    loading={loading}
                    mode={mode}
                    onModeChange={setMode}
                />

                {error && <div className="error-box">Error: {error}</div>}

                {loading && (
                    <div className="loading-overlay">
                        <span className="spinner" /> Running ODE solver...
                    </div>
                )}

                {result && (
                    <>
                        <KPICards kpis={result.kpis} mode={result.mode} />
                        <Charts timeSeries={result.timeSeries} />
                        <DataTable timeSeries={result.timeSeries} params={result.params} />
                    </>
                )}
            </div>
        </div>
    );
}
