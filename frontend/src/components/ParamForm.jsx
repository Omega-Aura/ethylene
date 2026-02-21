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

/* ═══ MODE DEFINITIONS ═══ */
const MODES = [
    {
        id: 'baseline',
        label: 'Conservative (export-only)',
        description: 'v1 default — bacteria consume root-zone ACC only. ~18% ethylene reduction.',
        color: '#94a3b8',
        icon: '🔬',
    },
    {
        id: 'high_export',
        label: 'High ACC Export',
        description: 'Increased ACC export rate (k_exp ≈ 0.45 h⁻¹) — more ACC routed to rhizosphere. Can reach >50% reduction.',
        color: '#3b82f6',
        icon: '🚀',
    },
    {
        id: 'endophytic',
        label: 'Endophytic ACCD (direct sink)',
        description: 'Bacteria directly access plant-side ACC (f_direct = 0.5) — competing with ACO inside tissue.',
        color: '#a855f7',
        icon: '🧫',
    },
    {
        id: 'feedback',
        label: 'Regulatory Feedback (ACS/ACO)',
        description: 'Ethylene negatively regulates ACS — ACCD-induced reduction cascades via lower ACC synthesis.',
        color: '#f59e0b',
        icon: '🔄',
    },
    {
        id: 'custom',
        label: 'Custom',
        description: 'Manually configure all parameters below, including v2 extensions.',
        color: '#2dd4bf',
        icon: '⚙️',
    },
];

/* ═══ PARAMETER GROUPS ═══ */
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
        title: 'Endophytic ACCD (v2)',
        icon: '🧫',
        description: 'Feature B — direct bacterial sink on plant-side ACC. Set f_direct > 0 to enable.',
        v2: true,
        fields: [
            { id: 'f_direct', katex: 'f_{\\text{direct}}', unit: '0–1', default: 0.0, step: 0.1, hint: 'Fraction of Xb acting directly on plant ACC' },
            { id: 'V_max_ACCD_direct', katex: 'V_{\\max,\\text{dir}}^{\\text{ACCD}}', unit: 'mM/(g·h)', default: 1.0, step: 0.1, hint: 'Vmax for direct ACCD on plant ACC' },
            { id: 'K_m_ACCD_direct', katex: 'K_{m,\\text{dir}}^{\\text{ACCD}}', unit: 'mM', default: 1.5, step: 0.5, hint: 'Km for direct ACCD on plant ACC' },
        ],
    },
    {
        title: 'ACS/ACO Feedback (v2)',
        icon: '🔄',
        description: 'Feature C — negative feedback from ethylene on ACS (and optionally ACO) activity.',
        v2: true,
        fields: [
            { id: 'fb_enable', katex: '\\text{fb\\_enable}', unit: '0/1', default: 0, step: 1, hint: 'Enable ACS feedback (0 = off, 1 = on)' },
            { id: 'K_fb', katex: 'K_{\\text{fb}}', unit: 'M', default: 5e-5, step: 1e-5, hint: 'Ethylene level for 50% ACS repression' },
            { id: 'n_fb', katex: 'n_{\\text{fb}}', unit: '–', default: 2.0, step: 0.5, hint: 'Hill coefficient for ACS feedback' },
            { id: 'aco_fb_enable', katex: '\\text{aco\\_fb}', unit: '0/1', default: 0, step: 1, hint: 'Enable ACO feedback (0 = off, 1 = on)' },
            { id: 'K_fb_aco', katex: 'K_{\\text{fb,ACO}}', unit: 'M', default: 5e-5, step: 1e-5, hint: 'Ethylene level for 50% ACO repression' },
            { id: 'n_fb_aco', katex: 'n_{\\text{fb,ACO}}', unit: '–', default: 2.0, step: 0.5, hint: 'Hill coefficient for ACO feedback' },
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

/* ═══ MODE PRESETS — override defaults when mode changes ═══ */
const MODE_PARAM_OVERRIDES = {
    baseline: {},
    high_export: { k_exp: 0.45 },
    endophytic: { f_direct: 0.5, V_max_ACCD_direct: 1.0, K_m_ACCD_direct: 1.5 },
    feedback: { fb_enable: 1, K_fb: 2e-4, n_fb: 3.0 },
    custom: {},
};


export default function ParamForm({ params, onChange, onRun, onReset, loading, mode, onModeChange }) {
    const handleChange = (id, val) => {
        onChange({ ...params, [id]: parseFloat(val) || 0 });
    };

    const handleModeSelect = (modeId) => {
        onModeChange(modeId);
        // Apply mode preset values
        const overrides = MODE_PARAM_OVERRIDES[modeId] || {};
        // Reset v2 params to defaults first, then apply overrides
        const base = getDefaults();
        const newParams = { ...params };
        // Reset v2-specific fields to defaults
        ['f_direct', 'V_max_ACCD_direct', 'K_m_ACCD_direct', 'fb_enable', 'K_fb', 'n_fb', 'aco_fb_enable', 'K_fb_aco', 'n_fb_aco', 'k_exp'].forEach(k => {
            newParams[k] = base[k];
        });
        // Apply mode overrides
        Object.entries(overrides).forEach(([k, v]) => {
            newParams[k] = v;
        });
        onChange(newParams);
    };

    return (
        <div className="section">
            {/* ── Mode Selector ── */}
            <div className="param-section-header">
                <span className="param-section-icon">🎛️</span>
                <span className="param-section-title">Simulation Mode</span>
            </div>
            <div className="param-section-note">
                Select a scenario preset to explore different plant–microbe interaction mechanisms.
                Each mode configures the v2 parameters automatically. Choose <strong>"Custom"</strong> for full manual control.
            </div>
            <div className="mode-selector-grid">
                {MODES.map((m) => (
                    <button
                        key={m.id}
                        className={`mode-card ${mode === m.id ? 'mode-active' : ''}`}
                        style={{ '--mode-color': m.color }}
                        onClick={() => handleModeSelect(m.id)}
                    >
                        <div className="mode-card-top">
                            <span className="mode-icon">{m.icon}</span>
                            <span className="mode-badge" style={{ background: m.color }}>{m.id.replace('_', ' ')}</span>
                        </div>
                        <div className="mode-label">{m.label}</div>
                        <div className="mode-desc">{m.description}</div>
                    </button>
                ))}
            </div>

            {/* ── Parameters ── */}
            <div className="param-section-header" style={{ marginTop: '2rem' }}>
                <span className="param-section-icon">⚛️</span>
                <span className="param-section-title">Model Parameters</span>
            </div>
            <div className="param-section-note">
                Adjust the kinetic, volumetric, and initial-condition parameters below. Each group
                corresponds to a module in the ODE system. <span style={{ color: '#a855f7' }}>Purple-bordered</span> cards are v2 extensions.
            </div>

            <div className="grid-form">
                {PARAM_GROUPS.map((group, gi) => (
                    <div className={`param-card ${group.v2 ? 'param-card-v2' : ''}`} key={group.title}>
                        <div className="param-card-header">
                            <span className="param-card-badge">{group.icon}</span>
                            <div>
                                <div className="param-card-title">
                                    {group.title}
                                    {group.v2 && <span className="v2-tag">NEW</span>}
                                </div>
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
