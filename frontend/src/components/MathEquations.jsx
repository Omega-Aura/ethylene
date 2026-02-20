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
function EqSection({ number, title, children }) {
    return (
        <div className="math-section">
            <div className="math-section-header">
                <span className="math-badge">{number}</span>
                <h3>{title}</h3>
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
                The bioreactor simulation is based on established mathematical models that describe
                microbial growth, substrate utilization, oxygen transfer, and power requirements.
            </div>

            {/* ── 1. Plant ACC Dynamics ── */}
            <EqSection number={1} title="Plant ACC Dynamics (Inside Tissue)">
                <EqBlock math={String.raw`\frac{d[\text{ACC}]_p}{dt} = v_{\text{ACS}} - v_{\text{ACO}} - v_{\text{export}}`} />

                <p className="eq-description">
                    <strong>Description:</strong> Intracellular ACC in plant tissue is produced by ACC synthase
                    (ACS) under stress, consumed by ACC oxidase (ACO) to form ethylene, and exported to the
                    root zone.
                </p>

                <div className="eq-sub-title">ACC synthesis (ACS):</div>
                <EqBlock math={String.raw`v_{\text{ACS}} = V_{\text{ACS,max}} \cdot f_{\text{stress}}(t)`} />

                <div className="eq-sub-title">ACC → Ethylene (ACO):</div>
                <EqBlock math={String.raw`v_{\text{ACO}} = k_{\text{ACO}} \cdot [\text{ACC}]_p`} />

                <div className="eq-sub-title">ACC export to root zone:</div>
                <EqBlock math={String.raw`v_{\text{export}} = k_{\text{exp}} \cdot [\text{ACC}]_p`} />

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
                    undergoes minor non-enzymatic losses.
                </p>

                <div className="eq-sub-title">Bacterial ACCD uptake (Michaelis–Menten per biomass):</div>
                <EqBlock
                    math={String.raw`v_{\text{ACCD}} = X_b \cdot \frac{V_{\max}^{\text{ACCD}} \, [\text{ACC}]_r}{K_m^{\text{ACCD}} + [\text{ACC}]_r}`}
                />

                <p className="eq-variables-title">Variables:</p>
                <ul className="eq-variables">
                    <Var symbol="V_{\text{plant}}">Effective plant tissue volume contributing ACC</Var>
                    <Var symbol="V_{\text{root}}">Liquid volume of the root zone / hydroponic solution</Var>
                    <Var symbol="V_{\max}^{\text{ACCD}}">nmol ACC converted per g biomass per hour</Var>
                    <Var symbol="K_m^{\text{ACCD}}">Michaelis constant (mM); typical 1.5–17 mM</Var>
                    <Var symbol="X_b">Bacterial biomass (g DCW / L)</Var>
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
            <EqSection number={5} title="Plant Growth / Stress Output (Optional)">
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
        </div>
    );
}
