import PathwayDiagram from '../components/PathwayDiagram';
import { Link } from 'react-router-dom';

const STATE_VARS = [
    { num: 1, symbol: 'Aₚ', name: 'Plant ACC', desc: 'Intracellular ACC concentration in plant tissue (mM)' },
    { num: 2, symbol: 'Aᵣ', name: 'Root-zone ACC', desc: 'Extracellular ACC in the rhizosphere (mM)' },
    { num: 3, symbol: 'Cₑ', name: 'Ethylene', desc: 'Gas-phase ethylene concentration in greenhouse air (µM)' },
    { num: 4, symbol: 'Xb', name: 'Bacterial Biomass', desc: 'PGPR dry cell weight in root zone (g DCW/L)' },
    { num: 5, symbol: 'G', name: 'Plant Growth Index', desc: 'Dimensionless growth metric (starts at 1.0)' },
];

const FEATURES = [
    { icon: '⚡', title: 'Side-by-side Comparison', desc: 'Runs two parallel simulations: Control (no bacteria) vs. ACCD-inoculated' },
    { icon: '🎛️', title: '20+ Tunable Parameters', desc: 'Grouped into 8 categories with literature-based defaults and units' },
    { icon: '📊', title: '4 Interactive Charts', desc: 'Ethylene, Root-zone ACC, Bacterial Biomass, and Plant Growth over time' },
    { icon: '📈', title: 'KPI Dashboard', desc: 'Peak/steady-state ethylene reduction (%) and growth improvement (%)' },
    { icon: '📋', title: 'CSV Export', desc: 'Download full time-series data and parameter sets' },
    { icon: '🔬', title: 'v2 Extensions', desc: '3 toggleable mechanisms: Enhanced export, Endophytic ACCD, Regulatory feedback' },
];

const TECH_STACK = [
    { name: 'SciPy', desc: 'ODE Solver (RK45)', color: '#3b82f6' },
    { name: 'FastAPI', desc: 'REST API', color: '#009688' },
    { name: 'React 19', desc: 'Frontend SPA', color: '#61dafb' },
    { name: 'Recharts', desc: 'Interactive Charts', color: '#8884d8' },
    { name: 'KaTeX', desc: 'Math Rendering', color: '#34d399' },
    { name: 'Vite 7', desc: 'Build Tool', color: '#646cff' },
];

export default function HomePage() {
    return (
        <div className="page-home">
            {/* Hero */}
            <header className="hero">
                <h1>ACC-Ethylene-ACCD Mathematical Model</h1>
                <p className="sub">
                    Interactive ODE simulation of how ACC deaminase-expressing <em>B.&nbsp;subtilis</em> reduces plant ethylene via root-zone ACC consumption
                </p>
                <div className="hero-badges">
                    <span className="badge">iGEM 2026 &middot; Computational Modeling</span>
                    <span className="badge badge-v2">v2 &middot; Extended Interaction</span>
                </div>
            </header>

            <div className="container">
                {/* About */}
                <section className="home-section">
                    <h2 className="home-section-title">
                        <span className="home-section-icon">📖</span>
                        About the Model
                    </h2>
                    <div className="home-about-card">
                        <p>
                            Plants under abiotic stress (drought, salinity, flooding) overproduce the hormone <strong style={{ color: '#fbbf24' }}>ethylene</strong> via the ACC pathway, which inhibits root elongation and overall growth.
                        </p>
                        <p>
                            Certain soil bacteria — <strong style={{ color: '#3b82f6' }}>Plant Growth-Promoting Rhizobacteria (PGPR)</strong> — express the enzyme <strong style={{ color: '#2dd4bf' }}>ACC deaminase (ACCD)</strong>, which cleaves the ethylene precursor <strong style={{ color: '#2dd4bf' }}>ACC</strong> in the root zone, lowering ethylene levels and rescuing plant growth.
                        </p>
                        <p>
                            This application models that interaction as a <strong>5-state ODE system</strong> and lets you simulate it interactively in your browser.
                        </p>
                    </div>
                </section>

                {/* Pathway Diagram */}
                <section className="home-section">
                    <h2 className="home-section-title">
                        <span className="home-section-icon">🔄</span>
                        Biochemical Pathway
                    </h2>
                    <PathwayDiagram />
                </section>

                {/* Key Mechanism */}
                <section className="home-section">
                    <h2 className="home-section-title">
                        <span className="home-section-icon">🔑</span>
                        Key Mechanism
                    </h2>
                    <div className="home-mechanism-card">
                        <p>ACC export from the plant to the root zone is <strong>gradient-driven</strong>:</p>
                        <div className="home-mechanism-eq">
                            v<sub>export</sub> = k<sub>exp</sub> · max( A<sub>p</sub> − A<sub>r</sub> / (V<sub>p</sub>/V<sub>r</sub>), 0 )
                        </div>
                        <p>
                            When ACCD bacteria consume root-zone ACC (A<sub>r</sub> ↓), the gradient steepens → more ACC is exported from the plant → plant A<sub>p</sub> drops → less ethylene is produced → <strong style={{ color: '#34d399' }}>growth inhibition is relieved</strong>.
                        </p>
                    </div>
                </section>

                {/* State Variables */}
                <section className="home-section">
                    <h2 className="home-section-title">
                        <span className="home-section-icon">🧬</span>
                        Five State Variables
                    </h2>
                    <div className="home-vars-grid">
                        {STATE_VARS.map((v) => (
                            <div className="home-var-card" key={v.num}>
                                <div className="home-var-num">{v.num}</div>
                                <div className="home-var-symbol">{v.symbol}</div>
                                <div className="home-var-name">{v.name}</div>
                                <div className="home-var-desc">{v.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="home-section">
                    <h2 className="home-section-title">
                        <span className="home-section-icon">✨</span>
                        Features
                    </h2>
                    <div className="home-features-grid">
                        {FEATURES.map((f, i) => (
                            <div className="home-feature-card" key={i}>
                                <span className="home-feature-icon">{f.icon}</span>
                                <div className="home-feature-title">{f.title}</div>
                                <div className="home-feature-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="home-section">
                    <h2 className="home-section-title">
                        <span className="home-section-icon">🛠️</span>
                        Tech Stack
                    </h2>
                    <div className="home-tech-row">
                        {TECH_STACK.map((t) => (
                            <div className="home-tech-chip" key={t.name} style={{ borderColor: t.color }}>
                                <span className="home-tech-name" style={{ color: t.color }}>{t.name}</span>
                                <span className="home-tech-desc">{t.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="home-section home-cta">
                    <h2>Ready to simulate?</h2>
                    <p>Explore the equations or jump straight into the interactive simulation.</p>
                    <div className="home-cta-btns">
                        <Link to="/math" className="btn btn-secondary">📐 View Math Model</Link>
                        <Link to="/simulation" className="btn btn-primary">🔬 Run Simulation</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
