import MathEquations from '../components/MathEquations';

export default function MathModelPage() {
    return (
        <div className="page-math">
            <header className="page-header">
                <h1 className="page-title">
                    <span className="page-title-icon">📐</span>
                    Mathematical Models &amp; Equations
                </h1>
                <p className="page-subtitle">
                    The 5-state ODE system describing ACC biosynthesis, bacterial ACCD activity, and ethylene reduction, with v2 extensions for enhanced mechanisms.
                </p>
            </header>
            <div className="container">
                <MathEquations />
            </div>
        </div>
    );
}
