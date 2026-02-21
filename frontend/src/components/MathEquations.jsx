import { useEffect, useRef } from 'react';
import katex from 'katex';

/* ── tiny helper: render a KaTeX string into a <span> ── */
function K({ math, display = false }) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            katex.render(math, ref.current, {
                throwOnError: false,
                displayMode: display,
            });
        }
    }, [math, display]);
    return <span ref={ref} />;
}

/* ── One equation section card ── */
function EqSection({ number, title, isV2 = false, children }) {
    return (
        <div className={`math-section ${isV2 ? 'math-section-v2' : ''}`}>
            <div className="math-section-header">
                <span className={`math-badge ${isV2 ? 'math-badge-v2' : ''}`}>{number}</span>
                <h3>
                    {title}
                    {isV2 && <span className="v2-tag">v2</span>}
                </h3>
            </div>
            {children}
        </div>
    );
}

/* ── Centred display equation ── */
function EqBlock({ math }) {
    return (
        <div className="eq-block">
            <K math={math} display />
        </div>
    );
}

/* ── Variable bullet ── */
function Var({ symbol, children }) {
    return (
        <li>
            <K math={symbol} /> = {children}
        </li>
    );
}

/* ── Physical meaning callout ── */
function PhysicalMeaning({ children }) {
    return <div className="eq-physical">{children}</div>;
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function MathEquations() {
    return (
        <div className="math-equations-wrapper">
            <div className="math-equations-intro">
                <span className="math-equations-icon">📐</span>
                <span className="math-equations-title">Mathematical Models &amp; Equations</span>
            </div>
            <div className="math-equations-note">
                The simulation is based on established mathematical models that describe
                microbial growth, substrate utilization, ACC transport, and ethylene biosynthesis.
                <strong> v2 extensions</strong> (marked with purple borders) add three optional mechanisms
                for enhanced ethylene reduction.
            </div>

            {/* ── 1. Plant ACC Dynamics ── */}
            <EqSection number={1} title="Plant ACC Dynamics (Inside Tissue)">
                <div className="eq-sub-title">v1 (Baseline):</div>
                <EqBlock math={String.raw`\frac{d[\text{ACC}]_p}{dt} = v_{\text{ACS}} - v_{\text{ACO}} - v_{\text{export}}`} />

                <div className="eq-sub-title" style={{ color: '#a855f7' }}>v2 (with Endophytic ACCD + Feedback):</div>
                <EqBlock math={String.raw`\frac{d[\text{ACC}]_p}{dt} = v_{\text{ACS}} \cdot f_{\text{fb}}(C_E) - k_{\text{ACO}}^{\text{eff}} \cdot A_p - v_{\text{export}} - v_{\text{bact,p}}`} />

                <p className="eq-description">
                    <strong>Description:</strong> Intracellular ACC in plant tissue is produced by ACC synthase
                    (ACS) under stress, consumed by ACC oxidase (ACO) to form ethylene, and exported to the
                    root zone. In v2, bacteria can also directly consume plant ACC (endophytic sink), and
                    ACS activity can be modulated by ethylene feedback.
                </p>

                <div className="eq-sub-title">ACC synthesis (ACS):</div>
                <EqBlock math={String.raw`v_{\text{ACS}} = V_{\text{ACS,max}} \cdot f_{\text{stress}}(t)`} />

                <div className="eq-sub-title">ACC → Ethylene (ACO):</div>
                <EqBlock math={String.raw`v_{\text{ACO}} = k_{\text{ACO}} \cdot [\text{ACC}]_p`} />

                <div className="eq-sub-title">ACC export to root zone (gradient-driven):</div>
                <EqBlock math={String.raw`v_{\text{export}} = k_{\text{exp}} \cdot \max\!\left(A_p - \frac{A_r}{V_p / V_r},\; 0\right)`} />

                <p className="eq-variables-title">Variables:</p>
                <ul className="eq-variables">
                    <Var symbol="V_{\text{ACS,max}}">Max ACC production rate (mM·h⁻¹)</Var>
                    <Var symbol="f_{\text{stress}}(t)">Stress factor (≥1); step or time-varying profile</Var>
                    <Var symbol="k_{\text{ACO}}">First-order rate constant for ACC oxidase (h⁻¹)</Var>
                    <Var symbol="k_{\text{exp}}">Lumped rate for ACC exudation/transport (h⁻¹)</Var>
                </ul>

                <PhysicalMeaning>
                    <strong>Physical Meaning:</strong> Under stress, ACS activity rises, increasing the
                    intracellular ACC pool. ACO converts ACC to ethylene while a fraction is exported to the
                    rhizosphere where bacteria can intercept it.
                </PhysicalMeaning>
            </EqSection>

            {/* ── 2. Root Zone ACC Pool ── */}
            <EqSection number={2} title="Root Zone ACC Pool">
                <EqBlock
                    math={String.raw`\frac{d[\text{ACC}]_r}{dt} = \frac{v_{\text{export}} \cdot V_{\text{plant}}}{V_{\text{root}}} - v_{\text{ACCD}} - k_{\text{loss}}[\text{ACC}]_r`}
                />

                <p className="eq-description">
                    <strong>Description:</strong> ACC accumulates in the root zone / hydroponic medium from
                    plant export, is consumed by bacterial ACCD activity (Michaelis–Menten kinetics), and
                    undergoes minor non-enzymatic losses. In v2, only the <em>rhizosphere fraction</em> of
                    bacteria contributes here.
                </p>

                <div className="eq-sub-title">Bacterial ACCD uptake (Michaelis–Menten per biomass):</div>
                <div className="eq-sub-title" style={{ color: '#a855f7', fontSize: '0.78rem' }}>v2: uses X<sub>b</sub><sup>rhizo</sup> = (1 − f<sub>direct</sub>) · X<sub>b</sub></div>
                <EqBlock
                    math={String.raw`v_{\text{ACCD}} = X_b^{\text{rhizo}} \cdot \frac{V_{\max}^{\text{ACCD}} \, [\text{ACC}]_r}{K_m^{\text{ACCD}} + [\text{ACC}]_r}`}
                />

                <p className="eq-variables-title">Variables:</p>
                <ul className="eq-variables">
                    <Var symbol="V_{\text{plant}}">Effective plant tissue volume contributing ACC</Var>
                    <Var symbol="V_{\text{root}}">Liquid volume of the root zone / hydroponic solution</Var>
                    <Var symbol="V_{\max}^{\text{ACCD}}">nmol ACC converted per g biomass per hour</Var>
                    <Var symbol="K_m^{\text{ACCD}}">Michaelis constant (mM); typical 1.5–17 mM</Var>
                    <Var symbol="X_b^{\text{rhizo}}">(1 − f<sub>direct</sub>) · X<sub>b</sub> — rhizosphere biomass fraction</Var>
                    <Var symbol="k_{\text{loss}}">Non-enzymatic ACC breakdown rate (h⁻¹)</Var>
                </ul>

                <PhysicalMeaning>
                    <strong>Physical Meaning:</strong> The root zone acts as a shared pool — ACC arrives from
                    plant export and is drained by bacterial ACCD. More bacteria or higher ACCD activity
                    lowers root-zone ACC, reducing substrate available for ethylene synthesis.
                </PhysicalMeaning>
            </EqSection>

            {/* ── 3. Ethylene in Plant / Greenhouse ── */}
            <EqSection number={3} title="Ethylene in Plant / Greenhouse">
                <p className="eq-description" style={{ marginBottom: '0.6rem' }}>
                    <strong>Description:</strong> Ethylene is produced in plant tissue from ACC and then
                    equilibrates into the greenhouse air. No microbial ethylene uptake is considered — all
                    control is via the ACC sink.
                </p>

                <div className="eq-sub-title">Plant ethylene production rate:</div>
                <EqBlock math={String.raw`P_E = y_E \cdot v_{\text{ACO}}`} />

                <div className="eq-sub-title">Gas-phase ethylene balance (greenhouse air volume <K math="V_{\text{air}}" />):</div>
                <EqBlock
                    math={String.raw`\frac{dC_E}{dt} = \frac{P_E}{V_{\text{air}}} - k_{\text{vent}} \, C_E - k_{\text{ads}} \, C_E`}
                />

                <p className="eq-variables-title">Variables:</p>
                <ul className="eq-variables">
                    <Var symbol="y_E">Stoichiometric yield (mol ethylene per mol ACC; ≈ 1)</Var>
                    <Var symbol="P_E">Ethylene production rate</Var>
                    <Var symbol="k_{\text{vent}}">Loss via ventilation / leakage (h⁻¹)</Var>
                    <Var symbol="k_{\text{ads}}">Adsorption to surfaces or chemical scrubbers (h⁻¹)</Var>
                </ul>

                <PhysicalMeaning>
                    <strong>Physical Meaning:</strong> Ethylene builds up in the greenhouse air from plant ACO
                    activity and is removed by ventilation. When ACCD bacteria consume root-zone ACC, less ACC
                    reaches ACO, so ethylene production drops.
                </PhysicalMeaning>
            </EqSection>

            {/* ── 4. Bacterial Biomass Dynamics ── */}
            <EqSection number={4} title="Bacterial Biomass Dynamics">
                <EqBlock math={String.raw`\frac{dX_b}{dt} = \mu_b \, X_b - k_d \, X_b`} />

                <p className="eq-description">
                    <strong>Description:</strong> Bacterial biomass grows on ACC as a carbon / nitrogen source
                    and decays at a maintenance rate. Growth follows Monod kinetics on root-zone ACC.
                </p>

                <div className="eq-sub-title">Specific growth rate on ACC:</div>
                <EqBlock
                    math={String.raw`\mu_b = \mu_{\max} \cdot \frac{[\text{ACC}]_r}{K_s + [\text{ACC}]_r}`}
                />

                <p className="eq-variables-title">Variables:</p>
                <ul className="eq-variables">
                    <Var symbol="\mu_{\max}">Maximum specific growth rate (h⁻¹)</Var>
                    <Var symbol="K_s">Half-saturation constant for ACC (mM)</Var>
                    <Var symbol="k_d">Decay / maintenance rate (h⁻¹)</Var>
                </ul>

                <PhysicalMeaning>
                    <strong>Physical Meaning:</strong> When root-zone ACC is abundant{' '}
                    (<K math="[\text{ACC}]_r \gg K_s" />), bacteria grow at <K math="\mu_{\max}" />.
                    When ACC is scarce, growth slows and can be offset by decay, reaching a natural steady
                    state.
                </PhysicalMeaning>
            </EqSection>

            {/* ── 5. Plant Growth / Stress Output ── */}
            <EqSection number={5} title="Plant Growth / Stress Output">
                <EqBlock math={String.raw`\frac{dG}{dt} = r_g \cdot f(C_E)`} />

                <p className="eq-description">
                    <strong>Description:</strong> A simple "plant growth factor" inhibited by ethylene
                    concentration. This links ACCD activity → lower ethylene → better growth.
                </p>

                <div className="eq-sub-title">Inhibition function (Hill-type):</div>
                <EqBlock
                    math={String.raw`f(C_E) = \frac{1}{1 + \left(\dfrac{C_E}{C_{50}}\right)^n}`}
                />

                <p className="eq-variables-title">Variables:</p>
                <ul className="eq-variables">
                    <Var symbol="r_g">Intrinsic plant growth rate</Var>
                    <Var symbol="G">Plant growth index (dimensionless or biomass)</Var>
                    <Var symbol="C_{50}">Ethylene concentration producing 50 % growth inhibition</Var>
                    <Var symbol="n">Hill coefficient (cooperativity)</Var>
                </ul>

                <PhysicalMeaning>
                    <strong>Physical Meaning:</strong> When ethylene is low{' '}
                    (<K math="C_E \ll C_{50}" />), the plant grows near its intrinsic rate. High ethylene
                    suppresses growth via the Hill function, visually linking ACCD efficacy to plant health in
                    simulation plots.
                </PhysicalMeaning>
            </EqSection>

            {/* ═══════════════════════════════════════
                  v2 EXTENSION EQUATIONS
                ═══════════════════════════════════════ */}

            {/* ── 6. Feature B: Direct Bacterial Sink (Endophytic) ── */}
            <EqSection number={"B"} title="Feature B — Direct Bacterial Sink on Plant ACC" isV2>
                <p className="eq-description">
                    <strong>Rationale:</strong> Many ACCD-producing PGPR colonize the rhizoplane or internal
                    tissues, competing directly with plant ACO for intracellular ACC. This term allows a
                    fraction of bacterial ACCD to act on plant-side ACC.
                </p>

                <div className="eq-sub-title">Biomass split:</div>
                <EqBlock math={String.raw`X_b^{\text{direct}} = f_{\text{direct}} \cdot X_b, \qquad X_b^{\text{rhizo}} = (1 - f_{\text{direct}}) \cdot X_b`} />

                <div className="eq-sub-title">Direct plant-side ACCD term:</div>
                <EqBlock math={String.raw`v_{\text{bact,p}} = X_b^{\text{direct}} \cdot \frac{V_{\max,\text{direct}}^{\text{ACCD}} \, A_p}{K_{m,\text{direct}}^{\text{ACCD}} + A_p}`} />

                <div className="eq-sub-title">Modified plant ACC equation:</div>
                <EqBlock math={String.raw`\frac{dA_p}{dt} = v_{\text{ACS}} - k_{\text{ACO}} A_p - v_{\text{export}} - v_{\text{bact,p}}`} />

                <p className="eq-variables-title">New Parameters:</p>
                <ul className="eq-variables">
                    <Var symbol="f_{\text{direct}}">Fraction of biomass acting on plant ACC (0–1; default 0 = baseline)</Var>
                    <Var symbol="V_{\max,\text{direct}}^{\text{ACCD}}">Vmax for direct ACCD on plant ACC (mM/(g·h))</Var>
                    <Var symbol="K_{m,\text{direct}}^{\text{ACCD}}">Km for direct ACCD (mM)</Var>
                </ul>

                <PhysicalMeaning>
                    <strong>Physical Meaning:</strong> With moderate f<sub>direct</sub> and high Vmax, bacteria
                    directly compete with ACO for plant ACC. The fraction of ACC going to ethylene drops below
                    50% even if k<sub>exp</sub> remains small — representing strongly root-associated or
                    endophytic colonization.
                </PhysicalMeaning>
            </EqSection>

            {/* ── 7. Feature C: Regulatory Feedback on ACS/ACO ── */}
            <EqSection number={"C"} title="Feature C — Regulatory Feedback on ACS/ACO" isV2>
                <p className="eq-description">
                    <strong>Rationale:</strong> Ethylene biosynthesis is regulated at multiple levels. PGPR with
                    ACCD have been shown to modulate ACS/ACO transcript levels. This feature adds simple
                    negative feedback from ethylene to ACS (and optionally ACO).
                </p>

                <div className="eq-sub-title">Feedback-modulated ACS rate:</div>
                <EqBlock math={String.raw`v_{\text{ACS}} = V_{\text{ACS,max}} \cdot f_{\text{stress}} \cdot f_{\text{fb}}(C_E)`} />

                <div className="eq-sub-title">Feedback function (Hill-type repression):</div>
                <EqBlock math={String.raw`f_{\text{fb}}(C_E) = \frac{1}{1 + \left(\dfrac{C_E}{K_{\text{fb}}}\right)^{n_{\text{fb}}}}`} />

                <div className="eq-sub-title">Optional feedback on ACO:</div>
                <EqBlock math={String.raw`k_{\text{ACO}}^{\text{eff}} = k_{\text{ACO,base}} \cdot g(C_E), \quad g(C_E) = \frac{1}{1 + \left(\dfrac{C_E}{K_{\text{fb,ACO}}}\right)^{n_{\text{fb,ACO}}}}`} />

                <p className="eq-variables-title">New Parameters:</p>
                <ul className="eq-variables">
                    <Var symbol="K_{\text{fb}}">Ethylene level for 50% ACS repression (M)</Var>
                    <Var symbol="n_{\text{fb}}">Hill coefficient for ACS feedback (1–4)</Var>
                    <Var symbol="\text{fb\_enable}">Boolean toggle (0 or 1)</Var>
                </ul>

                <PhysicalMeaning>
                    <strong>Physical Meaning:</strong> Any initial ethylene reduction by ACCD leads to a
                    <em> secondary</em> decrease in ACS rate, reducing ACC production and long-term ethylene
                    levels beyond the direct enzymatic sink. This cascade effect can push ethylene reduction
                    well above 50% for illustration.
                </PhysicalMeaning>
            </EqSection>

            {/* ═══════════════════════════════════════
                  COMPLETE VARIABLE REFERENCE
                ═══════════════════════════════════════ */}
            <div className="var-ref-section">
                <div className="var-ref-header">
                    <span className="var-ref-icon">📋</span>
                    <span className="var-ref-title">Complete Variable Reference</span>
                </div>
                <p className="var-ref-note">
                    A unified reference of <strong>every variable and parameter</strong> used across all mathematical models.
                    Default values correspond to the <em>baseline</em> mode. Variables marked with
                    <span className="v2-tag" style={{ marginLeft: '0.3rem', verticalAlign: 'middle' }}>v2</span> are
                    extensions added in model v2.
                </p>

                {/* ─── State Variables ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)' }}>S</span>
                        State Variables (ODE Outputs)
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Name</th>
                                    <th>Units</th>
                                    <th>Initial (Default)</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="A_p" /></td>
                                    <td>Plant intracellular ACC concentration</td>
                                    <td>mM</td>
                                    <td><code>0.01</code></td>
                                    <td>Eq 1</td>
                                </tr>
                                <tr>
                                    <td><K math="A_r" /></td>
                                    <td>Root-zone ACC concentration</td>
                                    <td>mM</td>
                                    <td><code>0.0</code></td>
                                    <td>Eq 2</td>
                                </tr>
                                <tr>
                                    <td><K math="C_E" /></td>
                                    <td>Ethylene concentration (greenhouse air)</td>
                                    <td>M (molar)</td>
                                    <td><code>0.0</code></td>
                                    <td>Eq 3, 5, C</td>
                                </tr>
                                <tr>
                                    <td><K math="X_b" /></td>
                                    <td>Bacterial biomass</td>
                                    <td>g/L</td>
                                    <td><code>0.5</code></td>
                                    <td>Eq 4, B</td>
                                </tr>
                                <tr>
                                    <td><K math="G" /></td>
                                    <td>Plant growth index</td>
                                    <td>dimensionless</td>
                                    <td><code>1.0</code></td>
                                    <td>Eq 5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── Plant ACC / Ethylene Parameters ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>P</span>
                        Plant ACC &amp; Ethylene Parameters
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="V_{\text{ACS,max}}" /></td>
                                    <td>Max ACC synthesis rate</td>
                                    <td>mM/h</td>
                                    <td><code>0.05</code></td>
                                    <td>Eq 1</td>
                                </tr>
                                <tr>
                                    <td><K math="f_{\text{stress}}" /></td>
                                    <td>Stress multiplier (1 = none, 3–5 = severe)</td>
                                    <td>—</td>
                                    <td><code>3.0</code></td>
                                    <td>Eq 1</td>
                                </tr>
                                <tr>
                                    <td><K math="k_{\text{ACO}}" /></td>
                                    <td>ACC oxidase rate constant</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.30</code></td>
                                    <td>Eq 1, 3</td>
                                </tr>
                                <tr>
                                    <td><K math="k_{\text{exp}}" /></td>
                                    <td>ACC export / permeability coefficient</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.10</code></td>
                                    <td>Eq 1, 2</td>
                                </tr>
                                <tr>
                                    <td><K math="Y_{\text{eth}}" /></td>
                                    <td>Ethylene yield per ACC oxidized</td>
                                    <td>mol/mol</td>
                                    <td><code>1.0</code></td>
                                    <td>Eq 3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── ACCD Enzyme Kinetics ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>E</span>
                        ACCD Enzyme Kinetics
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="V_{\max}^{\text{ACCD}}" /></td>
                                    <td>Max ACCD V<sub>max</sub> per g biomass</td>
                                    <td>mM/(g·h)</td>
                                    <td><code>1.0</code></td>
                                    <td>Eq 2</td>
                                </tr>
                                <tr>
                                    <td><K math="K_m^{\text{ACCD}}" /></td>
                                    <td>Michaelis constant for ACCD</td>
                                    <td>mM</td>
                                    <td><code>1.5</code></td>
                                    <td>Eq 2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── Bacterial Growth (Monod) ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>B</span>
                        Bacterial Growth (Monod Kinetics)
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="\mu_{\max}" /></td>
                                    <td>Max bacterial specific growth rate</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.15</code></td>
                                    <td>Eq 4</td>
                                </tr>
                                <tr>
                                    <td><K math="K_s" /></td>
                                    <td>Monod half-saturation constant</td>
                                    <td>mM</td>
                                    <td><code>0.1</code></td>
                                    <td>Eq 4</td>
                                </tr>
                                <tr>
                                    <td><K math="k_d" /></td>
                                    <td>Bacterial decay / maintenance rate</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.01</code></td>
                                    <td>Eq 4</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── Volumes & Greenhouse ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>V</span>
                        Volumes &amp; Greenhouse
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="V_p / V_r" /></td>
                                    <td>Plant tissue vol / root zone vol ratio</td>
                                    <td>—</td>
                                    <td><code>0.10</code></td>
                                    <td>Eq 1, 2</td>
                                </tr>
                                <tr>
                                    <td><K math="V_p / V_{\text{air}}" /></td>
                                    <td>Plant tissue vol / greenhouse air vol ratio</td>
                                    <td>—</td>
                                    <td><code>0.001</code></td>
                                    <td>Eq 3</td>
                                </tr>
                                <tr>
                                    <td><K math="k_{\text{vent}}" /></td>
                                    <td>Ventilation / leakage rate</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.50</code></td>
                                    <td>Eq 3</td>
                                </tr>
                                <tr>
                                    <td><K math="k_{\text{scrub}}" /></td>
                                    <td>Chemical scrubber rate</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.0</code></td>
                                    <td>Eq 3</td>
                                </tr>
                                <tr>
                                    <td><K math="k_{\text{loss}}" /></td>
                                    <td>Non-enzymatic ACC loss in root zone</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.01</code></td>
                                    <td>Eq 2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── Plant Growth ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>G</span>
                        Plant Growth Parameters
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="r_g" /></td>
                                    <td>Intrinsic plant growth rate</td>
                                    <td>h⁻¹</td>
                                    <td><code>0.02</code></td>
                                    <td>Eq 5</td>
                                </tr>
                                <tr>
                                    <td><K math="K_E \;(C_{50})" /></td>
                                    <td>Ethylene IC50 for 50% growth inhibition</td>
                                    <td>µM</td>
                                    <td><code>0.0001</code></td>
                                    <td>Eq 5</td>
                                </tr>
                                <tr>
                                    <td><K math="n_{\text{hill}}" /></td>
                                    <td>Hill coefficient (cooperativity)</td>
                                    <td>—</td>
                                    <td><code>2.0</code></td>
                                    <td>Eq 5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── v2: Direct Bacterial Sink (Endophytic) ─── */}
                <div className="var-ref-group var-ref-group-v2">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>B</span>
                        Feature B — Direct Bacterial Sink (Endophytic)
                        <span className="v2-tag">v2</span>
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="f_{\text{direct}}" /></td>
                                    <td>Fraction of X<sub>b</sub> acting directly on plant ACC</td>
                                    <td>0–1</td>
                                    <td><code>0.0</code></td>
                                    <td>Eq B</td>
                                </tr>
                                <tr>
                                    <td><K math="V_{\max,\text{direct}}^{\text{ACCD}}" /></td>
                                    <td>V<sub>max</sub> for direct ACCD on plant ACC</td>
                                    <td>mM/(g·h)</td>
                                    <td><code>1.0</code></td>
                                    <td>Eq B</td>
                                </tr>
                                <tr>
                                    <td><K math="K_{m,\text{direct}}^{\text{ACCD}}" /></td>
                                    <td>K<sub>m</sub> for direct ACCD on plant ACC</td>
                                    <td>mM</td>
                                    <td><code>1.5</code></td>
                                    <td>Eq B</td>
                                </tr>
                                <tr>
                                    <td><K math="X_b^{\text{direct}}" /></td>
                                    <td>Endophytic biomass fraction</td>
                                    <td>g/L</td>
                                    <td>f<sub>direct</sub> · X<sub>b</sub></td>
                                    <td>Eq B</td>
                                </tr>
                                <tr>
                                    <td><K math="X_b^{\text{rhizo}}" /></td>
                                    <td>Rhizosphere biomass fraction</td>
                                    <td>g/L</td>
                                    <td>(1 − f<sub>direct</sub>) · X<sub>b</sub></td>
                                    <td>Eq 2, B</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── v2: Regulatory Feedback on ACS/ACO ─── */}
                <div className="var-ref-group var-ref-group-v2">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>C</span>
                        Feature C — Regulatory Feedback on ACS / ACO
                        <span className="v2-tag">v2</span>
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="\text{fb\_enable}" /></td>
                                    <td>ACS feedback toggle</td>
                                    <td>0 or 1</td>
                                    <td><code>0</code></td>
                                    <td>Eq C</td>
                                </tr>
                                <tr>
                                    <td><K math="K_{\text{fb}}" /></td>
                                    <td>Ethylene level for 50% ACS repression</td>
                                    <td>M</td>
                                    <td><code>5×10⁻⁵</code></td>
                                    <td>Eq C</td>
                                </tr>
                                <tr>
                                    <td><K math="n_{\text{fb}}" /></td>
                                    <td>Hill coefficient for ACS feedback</td>
                                    <td>—</td>
                                    <td><code>2.0</code></td>
                                    <td>Eq C</td>
                                </tr>
                                <tr>
                                    <td><K math="f_{\text{fb}}(C_E)" /></td>
                                    <td>ACS feedback repression function</td>
                                    <td>0–1</td>
                                    <td>Computed</td>
                                    <td>Eq 1, C</td>
                                </tr>
                                <tr>
                                    <td><K math="\text{aco\_fb\_enable}" /></td>
                                    <td>ACO feedback toggle</td>
                                    <td>0 or 1</td>
                                    <td><code>0</code></td>
                                    <td>Eq C</td>
                                </tr>
                                <tr>
                                    <td><K math="K_{\text{fb,ACO}}" /></td>
                                    <td>Ethylene level for 50% ACO repression</td>
                                    <td>M</td>
                                    <td><code>5×10⁻⁵</code></td>
                                    <td>Eq C</td>
                                </tr>
                                <tr>
                                    <td><K math="n_{\text{fb,ACO}}" /></td>
                                    <td>Hill coefficient for ACO feedback</td>
                                    <td>—</td>
                                    <td><code>2.0</code></td>
                                    <td>Eq C</td>
                                </tr>
                                <tr>
                                    <td><K math="k_{\text{ACO}}^{\text{eff}}" /></td>
                                    <td>Effective ACO rate (after feedback)</td>
                                    <td>h⁻¹</td>
                                    <td>Computed</td>
                                    <td>Eq 1, 3, C</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── Simulation Settings ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}>⚙</span>
                        Simulation Settings
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Parameter</th>
                                    <th>Units</th>
                                    <th>Default</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="t_{\text{end}}" /></td>
                                    <td>Simulation duration</td>
                                    <td>hours</td>
                                    <td><code>120.0</code></td>
                                    <td>Total time horizon for ODE integration</td>
                                </tr>
                                <tr>
                                    <td><K math="n_{\text{points}}" /></td>
                                    <td>Number of output time points</td>
                                    <td>—</td>
                                    <td><code>2000</code></td>
                                    <td>Resolution of ODE output; downsampled to 500 for JSON</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── Derived / Intermediate Quantities ─── */}
                <div className="var-ref-group">
                    <h4 className="var-ref-group-title">
                        <span className="var-ref-group-badge" style={{ background: 'linear-gradient(135deg, #e879f9, #c026d3)' }}>D</span>
                        Derived &amp; Intermediate Quantities
                    </h4>
                    <div className="var-table-wrap">
                        <table className="var-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Description</th>
                                    <th>Definition</th>
                                    <th>Equation(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><K math="v_{\text{ACS}}" /></td>
                                    <td>ACC synthesis flux</td>
                                    <td><K math="V_{\text{ACS,max}} \cdot f_{\text{stress}} \cdot f_{\text{fb}}" /></td>
                                    <td>Eq 1</td>
                                </tr>
                                <tr>
                                    <td><K math="v_{\text{ACO}}" /></td>
                                    <td>ACC → Ethylene flux</td>
                                    <td><K math="k_{\text{ACO}}^{\text{eff}} \cdot A_p" /></td>
                                    <td>Eq 1, 3</td>
                                </tr>
                                <tr>
                                    <td><K math="v_{\text{export}}" /></td>
                                    <td>ACC export to root zone</td>
                                    <td><K math="k_{\text{exp}} \cdot \max(A_p - A_r / (V_p/V_r),\; 0)" /></td>
                                    <td>Eq 1, 2</td>
                                </tr>
                                <tr>
                                    <td><K math="v_{\text{ACCD}}" /></td>
                                    <td>Bacterial ACCD uptake (root zone)</td>
                                    <td><K math="X_b^{\text{rhizo}} \cdot V_{\max}^{\text{ACCD}} \cdot A_r / (K_m^{\text{ACCD}} + A_r)" /></td>
                                    <td>Eq 2</td>
                                </tr>
                                <tr>
                                    <td><K math="v_{\text{bact,p}}" /></td>
                                    <td>Direct bacterial sink on plant ACC</td>
                                    <td><K math="X_b^{\text{direct}} \cdot V_{\max,\text{dir}}^{\text{ACCD}} \cdot A_p / (K_{m,\text{dir}}^{\text{ACCD}} + A_p)" /></td>
                                    <td>Eq B</td>
                                </tr>
                                <tr>
                                    <td><K math="\mu_b" /></td>
                                    <td>Specific bacterial growth rate</td>
                                    <td><K math="\mu_{\max} \cdot A_r / (K_s + A_r)" /></td>
                                    <td>Eq 4</td>
                                </tr>
                                <tr>
                                    <td><K math="f(C_E)" /></td>
                                    <td>Growth inhibition by ethylene</td>
                                    <td><K math="K_E^n / (K_E^n + C_E^n)" /></td>
                                    <td>Eq 5</td>
                                </tr>
                                <tr>
                                    <td><K math="P_E" /></td>
                                    <td>Ethylene production rate</td>
                                    <td><K math="Y_{\text{eth}} \cdot v_{\text{ACO}} \cdot (V_p/V_{\text{air}})" /></td>
                                    <td>Eq 3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
