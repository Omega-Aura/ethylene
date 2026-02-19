const PARAM_GROUPS = [
    {
        title: 'Plant ACC / Ethylene',
        fields: [
            { id: 'v_ACS', label: 'V_ACS,max', unit: 'mM/h', default: 0.05, step: 0.01, hint: 'Max ACC synthesis rate (ACS)' },
            { id: 'f_stress', label: 'f_stress', unit: '-', default: 3.0, step: 0.5, hint: 'Stress factor (1=none, 3-5=severe)' },
            { id: 'k_ACO', label: 'k_ACO', unit: '1/h', default: 0.30, step: 0.05, hint: 'ACC oxidase rate constant' },
            { id: 'k_exp', label: 'k_exp', unit: '1/h', default: 0.10, step: 0.01, hint: 'ACC export rate (plant to root)' },
            { id: 'Y_eth', label: 'Y_E', unit: 'mol/mol', default: 1.0, step: 0.1, hint: 'Ethylene yield per ACC' },
        ],
    },
    {
        title: 'ACCD Enzyme Kinetics',
        fields: [
            { id: 'V_max_ACCD', label: 'V_max ACCD', unit: 'mM/(g·h)', default: 1.0, step: 0.1, hint: 'Lit: 603-1350 nmol/mg/h' },
            { id: 'K_m_ACCD', label: 'K_m ACCD', unit: 'mM', default: 1.5, step: 0.5, hint: 'Range: 1.5-17.4 mM at pH 8.5' },
            { id: 'X_b0', label: 'X_b(0)', unit: 'g DCW/L', default: 0.5, step: 0.1, hint: 'Initial bacterial loading' },
        ],
    },
    {
        title: 'Bacterial Growth (Monod)',
        fields: [
            { id: 'mu_max', label: 'mu_max', unit: '1/h', default: 0.15, step: 0.01, hint: 'Max specific growth rate' },
            { id: 'K_s', label: 'K_s', unit: 'mM', default: 0.1, step: 0.05, hint: 'Monod half-saturation for ACC' },
            { id: 'k_d', label: 'k_d', unit: '1/h', default: 0.01, step: 0.005, hint: 'Decay / maintenance rate' },
        ],
    },
    {
        title: 'Volumes & Greenhouse',
        fields: [
            { id: 'Vp_Vr', label: 'Vp/Vr', unit: 'ratio', default: 0.10, step: 0.01, hint: 'Plant tissue vol / root zone vol' },
            { id: 'Vp_Vair', label: 'Vp/Vair', unit: 'ratio', default: 0.001, step: 0.0005, hint: 'Plant tissue vol / air vol' },
            { id: 'k_vent', label: 'k_vent', unit: '1/h', default: 0.50, step: 0.1, hint: 'Ventilation / leakage rate' },
            { id: 'k_scrub', label: 'k_scrub', unit: '1/h', default: 0.0, step: 0.01, hint: 'Chemical scrubber (0=none)' },
            { id: 'k_loss', label: 'k_loss', unit: '1/h', default: 0.01, step: 0.005, hint: 'Non-enzymatic ACC loss' },
        ],
    },
    {
        title: 'Plant Growth Index',
        fields: [
            { id: 'r_g', label: 'r_g', unit: '1/h', default: 0.02, step: 0.005, hint: 'Intrinsic plant growth rate' },
            { id: 'K_E', label: 'K_E (IC50)', unit: 'uM', default: 0.0001, step: 0.00005, hint: 'Ethylene conc for 50% growth inhibition' },
            { id: 'n_hill', label: 'n (Hill)', unit: '-', default: 2.0, step: 0.5, hint: 'Cooperativity of ethylene response' },
        ],
    },
    {
        title: 'Simulation Settings',
        fields: [
            { id: 't_end', label: 'Duration', unit: 'hours', default: 120, step: 10, hint: 'Total simulation time' },
            { id: 'n_points', label: 'Output Points', unit: '-', default: 2000, step: 100, hint: 'Number of output data points' },
            { id: 'A_p0', label: 'A_p(0)', unit: 'mM', default: 0.01, step: 0.005, hint: 'Initial plant ACC' },
            { id: 'A_r0', label: 'A_r(0)', unit: 'mM', default: 0.0, step: 0.005, hint: 'Initial root-zone ACC' },
            { id: 'E0', label: 'C_E(0)', unit: 'uM', default: 0.0, step: 0.001, hint: 'Initial ethylene' },
            { id: 'G0', label: 'G(0)', unit: '-', default: 1.0, step: 0.1, hint: 'Initial growth index' },
        ],
    },
];

export default function ParamForm({ params, onChange, onRun, onReset, loading }) {
    const handleChange = (id, val) => {
        onChange({ ...params, [id]: parseFloat(val) || 0 });
    };

    return (
        <div className="section">
            <h2 className="section-title"><span className="dot" /> Model Parameters</h2>
            <div className="grid-form">
                {PARAM_GROUPS.map((group) => (
                    <div className="card" key={group.title}>
                        <div className="card-title">{group.title}</div>
                        {group.fields.map((f) => (
                            <div className="field" key={f.id}>
                                <label>
                                    {f.label} <span className="unit">{f.unit}</span>
                                </label>
                                <input
                                    type="number"
                                    value={params[f.id] ?? f.default}
                                    step={f.step}
                                    min={0}
                                    onChange={(e) => handleChange(f.id, e.target.value)}
                                />
                                <div className="hint">{f.hint}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="btn-row">
                <button className="btn btn-primary" onClick={onRun} disabled={loading}>
                    {loading ? <><span className="spinner" /> Running...</> : '▶ Run Simulation'}
                </button>
                <button className="btn btn-secondary" onClick={onReset}>Reset Defaults</button>
            </div>
        </div>
    );
}

export function getDefaults() {
    const d = {};
    PARAM_GROUPS.forEach((g) => g.fields.forEach((f) => { d[f.id] = f.default; }));
    return d;
}
