import { useEffect, useRef } from 'react';
import katex from 'katex';

/* ── tiny KaTeX helper ── */
function K({ math }) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            katex.render(math, ref.current, { throwOnError: false });
        }
    }, [math]);
    return <span ref={ref} />;
}

const PARAM_GROUPS = [
    {
        title: 'Plant ACC / Ethylene',
        icon: '🌱',
        description: 'Controls ACC biosynthesis, oxidation to ethylene, and root export under stress conditions.',
        fields: [
            { id: 'v_ACS', katex: 'V_{\\text{ACS,max}}', unit: 'mM/h', default: 0.05, step: 0.01, hint: 'Max ACC synthesis rate (ACS)' },
            { id: 'f_stress', katex: 'f_{\\text{stress}}', unit: '–', default: 3.0, step: 0.5, hint: 'Stress factor (1 = none, 3–5 = severe)' },
            { id: 'k_ACO', katex: 'k_{\\text{ACO}}', unit: 'h⁻¹', default: 0.30, step: 0.05, hint: 'ACC oxidase rate constant' },
            { id: 'k_exp', katex: 'k_{\\text{exp}}', unit: 'h⁻¹', default: 0.10, step: 0.01, hint: 'ACC export rate (plant → root zone)' },
            { id: 'Y_eth', katex: 'Y_E', unit: 'mol/mol', default: 1.0, step: 0.1, hint: 'Stoichiometric ethylene yield per ACC' },
        ],
    },
    {
        title: 'ACCD Enzyme Kinetics',
        icon: '🧬',
        description: 'Michaelis–Menten parameters for ACC deaminase activity and initial bacterial loading.',
        fields: [
            { id: 'V_max_ACCD', katex: 'V_{\\max}^{\\text{ACCD}}', unit: 'mM/(g·h)', default: 1.0, step: 0.1, hint: 'Literature: 603–1350 nmol/mg/h' },
            { id: 'K_m_ACCD', katex: 'K_m^{\\text{ACCD}}', unit: 'mM', default: 1.5, step: 0.5, hint: 'Range: 1.5–17.4 mM at pH 8.5' },
            { id: 'X_b0', katex: 'X_b(0)', unit: 'g DCW/L', default: 0.5, step: 0.1, hint: 'Initial bacterial biomass loading' },
        ],
    },
    {
        title: 'Bacterial Growth (Monod)',
        icon: '🦠',
        description: 'Monod-type growth kinetics on ACC as the limiting carbon/nitrogen substrate.',
        fields: [
            { id: 'mu_max', katex: '\\mu_{\\max}', unit: 'h⁻¹', default: 0.15, step: 0.01, hint: 'Maximum specific growth rate' },
            { id: 'K_s', katex: 'K_s', unit: 'mM', default: 0.1, step: 0.05, hint: 'Monod half-saturation constant for ACC' },
            { id: 'k_d', katex: 'k_d', unit: 'h⁻¹', default: 0.01, step: 0.005, hint: 'Decay / maintenance rate' },
        ],
    },
    {
        title: 'Volumes & Greenhouse',
        icon: '🏠',
        description: 'Volume ratios and gas-phase loss rates governing ethylene accumulation in the greenhouse.',
        fields: [
            { id: 'Vp_Vr', katex: 'V_p \\,/\\, V_r', unit: 'ratio', default: 0.10, step: 0.01, hint: 'Plant tissue vol / root zone vol' },
            { id: 'Vp_Vair', katex: 'V_p \\,/\\, V_{\\text{air}}', unit: 'ratio', default: 0.001, step: 0.0005, hint: 'Plant tissue vol / air vol' },
            { id: 'k_vent', katex: 'k_{\\text{vent}}', unit: 'h⁻¹', default: 0.50, step: 0.1, hint: 'Ventilation / leakage rate' },
            { id: 'k_scrub', katex: 'k_{\\text{scrub}}', unit: 'h⁻¹', default: 0.0, step: 0.01, hint: 'Chemical scrubber (0 = none)' },
            { id: 'k_loss', katex: 'k_{\\text{loss}}', unit: 'h⁻¹', default: 0.01, step: 0.005, hint: 'Non-enzymatic ACC loss' },
        ],
    },
    {
        title: 'Plant Growth Index',
        icon: '📈',
        description: 'Hill-type inhibition linking ethylene concentration to plant growth suppression.',
        fields: [
            { id: 'r_g', katex: 'r_g', unit: 'h⁻¹', default: 0.02, step: 0.005, hint: 'Intrinsic plant growth rate' },
            { id: 'K_E', katex: 'K_E \\;(\\text{IC}_{50})', unit: 'µM', default: 0.0001, step: 0.00005, hint: 'Ethylene conc. for 50% growth inhibition' },
            { id: 'n_hill', katex: 'n \\;(\\text{Hill})', unit: '–', default: 2.0, step: 0.5, hint: 'Cooperativity of ethylene response' },
        ],
    },
    {
        title: 'Simulation Settings',
        icon: '⚙️',
        description: 'Time span, resolution, and initial state values for the ODE solver.',
        fields: [
            { id: 't_end', katex: 't_{\\text{end}}', unit: 'hours', default: 120, step: 10, hint: 'Total simulation time' },
            { id: 'n_points', katex: 'N_{\\text{pts}}', unit: '–', default: 2000, step: 100, hint: 'Number of output data points' },
            { id: 'A_p0', katex: '[\\text{ACC}]_p(0)', unit: 'mM', default: 0.01, step: 0.005, hint: 'Initial plant ACC concentration' },
            { id: 'A_r0', katex: '[\\text{ACC}]_r(0)', unit: 'mM', default: 0.0, step: 0.005, hint: 'Initial root-zone ACC concentration' },
            { id: 'E0', katex: 'C_E(0)', unit: 'µM', default: 0.0, step: 0.001, hint: 'Initial ethylene concentration' },
            { id: 'G0', katex: 'G(0)', unit: '–', default: 1.0, step: 0.1, hint: 'Initial growth index' },
        ],
    },
];

export default function ParamForm({ params, onChange, onRun, onReset, loading }) {
    const handleChange = (id, val) => {
        onChange({ ...params, [id]: parseFloat(val) || 0 });
    };

    return (
        <div className="section">
            <div className="param-section-header">
                <span className="param-section-icon">⚛️</span>
                <span className="param-section-title">Model Parameters</span>
            </div>
            <div className="param-section-note">
                Adjust the kinetic, volumetric, and initial-condition parameters below. Each group
                corresponds to a module in the ODE system. Hover over any card for details.
            </div>

            <div className="grid-form">
                {PARAM_GROUPS.map((group, gi) => (
                    <div className="param-card" key={group.title}>
                        <div className="param-card-header">
                            <span className="param-card-badge">{group.icon}</span>
                            <div>
                                <div className="param-card-title">{group.title}</div>
                                <div className="param-card-desc">{group.description}</div>
                            </div>
                        </div>
                        <div className="param-card-fields">
                            {group.fields.map((f) => (
                                <div className="param-field" key={f.id}>
                                    <label className="param-label">
                                        <span className="param-symbol">
                                            <K math={f.katex} />
                                        </span>
                                        <span className="param-unit">{f.unit}</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={params[f.id] ?? f.default}
                                        step={f.step}
                                        min={0}
                                        onChange={(e) => handleChange(f.id, e.target.value)}
                                    />
                                    <div className="param-hint">{f.hint}</div>
                                </div>
                            ))}
                        </div>
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
