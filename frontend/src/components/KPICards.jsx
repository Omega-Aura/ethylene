export default function KPICards({ kpis, mode }) {
    if (!kpis) return null;

    const mechanismLabels = {
        high_export: { label: 'High Export', color: '#3b82f6' },
        endophytic: { label: 'Endophytic', color: '#a855f7' },
        feedback: { label: 'Feedback', color: '#f59e0b' },
    };

    const items = [
        { label: 'Peak Ethylene (Control)', value: kpis.peakCtrl?.toExponential(4), detail: `µM at t=${kpis.tPeakCtrl}h` },
        { label: 'Peak Ethylene (ACCD)', value: kpis.peakACCD?.toExponential(4), detail: `µM at t=${kpis.tPeakACCD}h` },
        { label: 'Peak Reduction', value: `${kpis.reductionPeakPct}%`, cls: kpis.reductionPeakPct >= 50 ? 'good' : 'warn', detail: 'Target: ≥50%' },
        { label: 'SS Ethylene (Control)', value: kpis.ssCtrl?.toExponential(4), detail: 'µM' },
        { label: 'SS Ethylene (ACCD)', value: kpis.ssACCD?.toExponential(4), detail: 'µM' },
        { label: 'SS Reduction', value: `${kpis.reductionSSPct}%`, cls: kpis.reductionSSPct > 0 ? 'good' : 'warn' },
        { label: 'Growth Index (Control)', value: kpis.growthCtrl?.toFixed(4), detail: `at end` },
        { label: 'Growth Improvement', value: `${kpis.growthImprovePct}%`, cls: kpis.growthImprovePct > 0 ? 'good' : 'warn', detail: 'ACCD vs Control' },
        {
            label: 'Export Fraction',
            value: `${kpis.exportFractionPct}%`,
            cls: kpis.exportFractionPct > 40 ? 'good' : '',
            detail: 'k_exp / (k_exp + k_ACO) — theoretical max flux to root zone',
            tooltip: true,
        },
    ];

    return (
        <div className="section">
            <h2 className="section-title"><span className="dot" /> Key Performance Indicators</h2>

            {/* Active mechanisms badges */}
            {kpis.activeMechanisms && kpis.activeMechanisms.length > 0 && (
                <div className="kpi-mechanisms">
                    <span className="kpi-mech-label">Active Mechanisms:</span>
                    {kpis.activeMechanisms.map(m => (
                        <span
                            key={m}
                            className="kpi-mech-badge"
                            style={{ background: mechanismLabels[m]?.color || '#64748b' }}
                        >
                            {mechanismLabels[m]?.label || m}
                        </span>
                    ))}
                </div>
            )}

            <div className="kpi-grid">
                {items.map((item, i) => (
                    <div className={`kpi ${item.tooltip ? 'kpi-has-tooltip' : ''}`} key={i}>
                        <div className="kpi-label">{item.label}</div>
                        <div className={`kpi-value ${item.cls || ''}`}>{item.value}</div>
                        {item.detail && <div className="kpi-detail">{item.detail}</div>}
                        {item.tooltip && (
                            <div className="kpi-tooltip-icon" title={item.detail}>ℹ️</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
