export default function KPICards({ kpis }) {
    if (!kpis) return null;

    const items = [
        { label: 'Peak Ethylene (Control)', value: kpis.peakCtrl?.toExponential(4), detail: `uM at t=${kpis.tPeakCtrl}h` },
        { label: 'Peak Ethylene (ACCD)', value: kpis.peakACCD?.toExponential(4), detail: `uM at t=${kpis.tPeakACCD}h` },
        { label: 'Peak Reduction', value: `${kpis.reductionPeakPct}%`, cls: kpis.reductionPeakPct >= 50 ? 'good' : 'warn', detail: 'Target: >=50%' },
        { label: 'SS Ethylene (Control)', value: kpis.ssCtrl?.toExponential(4), detail: 'uM' },
        { label: 'SS Ethylene (ACCD)', value: kpis.ssACCD?.toExponential(4), detail: 'uM' },
        { label: 'SS Reduction', value: `${kpis.reductionSSPct}%`, cls: kpis.reductionSSPct > 0 ? 'good' : 'warn' },
        { label: 'Growth Index (Control)', value: kpis.growthCtrl?.toFixed(4), detail: `at end` },
        { label: 'Growth Improvement', value: `${kpis.growthImprovePct}%`, cls: kpis.growthImprovePct > 0 ? 'good' : 'warn', detail: 'ACCD vs Control' },
    ];

    return (
        <div className="section">
            <h2 className="section-title"><span className="dot" /> Key Performance Indicators</h2>
            <div className="kpi-grid">
                {items.map((item, i) => (
                    <div className="kpi" key={i}>
                        <div className="kpi-label">{item.label}</div>
                        <div className={`kpi-value ${item.cls || ''}`}>{item.value}</div>
                        {item.detail && <div className="kpi-detail">{item.detail}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
