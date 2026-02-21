/* PathwayDiagram — Full ACC-Ethylene-PGPR biological pathway */

export default function PathwayDiagram() {
    return (
        <div className="pathway">
            <svg viewBox="0 0 920 580" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>

                {/* ═══════ BACKGROUND REGIONS ═══════ */}
                {/* Plant Tissue – large left box */}
                <rect x="100" y="60" width="540" height="470" rx="12"
                    fill="rgba(45,212,191,0.05)" stroke="rgba(45,212,191,0.2)" strokeWidth="1.5" />
                <text x="370" y="545" textAnchor="middle" fill="#2dd4bf"
                    fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif"
                    letterSpacing="0.06em">PLANT TISSUE</text>

                {/* Bacterium – right box */}
                <rect x="660" y="60" width="240" height="470" rx="12"
                    fill="rgba(59,130,246,0.05)" stroke="rgba(59,130,246,0.2)" strokeWidth="1.5" />
                <text x="780" y="545" textAnchor="middle" fill="#3b82f6"
                    fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif"
                    letterSpacing="0.06em">BACTERIUM (PGPR)</text>

                {/* ═══════ EXTERNAL STRESS BOXES ═══════ */}
                {/* Top stress */}
                <rect x="295" y="5" width="150" height="36" rx="6"
                    fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="1.5" />
                <text x="370" y="28" textAnchor="middle" fill="#f87171"
                    fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">Abiotic / Biotic Stress</text>
                <line x1="370" y1="41" x2="370" y2="60"
                    stroke="#f87171" strokeWidth="1.5" markerEnd="url(#pw-arrowRed)" />

                {/* Left stress */}
                <rect x="0" y="270" width="75" height="50" rx="6"
                    fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="1.5" />
                <text x="37" y="291" textAnchor="middle" fill="#f87171"
                    fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">Abiotic /</text>
                <text x="37" y="304" textAnchor="middle" fill="#f87171"
                    fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">Biotic Stress</text>
                <line x1="75" y1="295" x2="130" y2="295"
                    stroke="#f87171" strokeWidth="1.5" markerEnd="url(#pw-arrowRed)" />

                {/* ═══════ INSIDE PLANT TISSUE ═══════ */}

                {/* Plant cell growth & proliferation */}
                <rect x="195" y="85" width="220" height="38" rx="7"
                    fill="rgba(52,211,153,0.08)" stroke="#34d399" strokeWidth="1.2" />
                <text x="305" y="109" textAnchor="middle" fill="#34d399"
                    fontSize="10.5" fontWeight="600" fontFamily="Inter,sans-serif">Plant Cell Growth &amp; Proliferation</text>

                {/* Auxin Response Factors */}
                <rect x="220" y="160" width="170" height="34" rx="7"
                    fill="rgba(168,85,247,0.08)" stroke="#a855f7" strokeWidth="1.2" />
                <text x="305" y="182" textAnchor="middle" fill="#a855f7"
                    fontSize="10" fontWeight="600" fontFamily="Inter,sans-serif">Auxin Response Factors</text>

                {/* Auxin Response → Plant Growth (up) */}
                <line x1="305" y1="160" x2="305" y2="123"
                    stroke="#34d399" strokeWidth="1.2" markerEnd="url(#pw-arrowGreen)" />

                {/* IAA (inside plant) */}
                <rect x="480" y="140" width="65" height="34" rx="7"
                    fill="rgba(52,211,153,0.08)" stroke="#34d399" strokeWidth="1.2" />
                <text x="512" y="162" textAnchor="middle" fill="#34d399"
                    fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">IAA</text>

                {/* IAA ↔ Auxin Response Factors (bidirectional) */}
                <line x1="480" y1="157" x2="392" y2="175"
                    stroke="#34d399" strokeWidth="1" markerEnd="url(#pw-arrowGreen)" />
                <line x1="392" y1="170" x2="480" y2="152"
                    stroke="#a855f7" strokeWidth="1" markerEnd="url(#pw-arrowPurple)" />

                {/* L-Tryptophan */}
                <rect x="420" y="230" width="120" height="32" rx="7"
                    fill="rgba(168,85,247,0.06)" stroke="rgba(168,85,247,0.4)" strokeWidth="1" />
                <text x="480" y="251" textAnchor="middle" fill="#c084fc"
                    fontSize="9.5" fontWeight="600" fontFamily="Inter,sans-serif">L-Tryptophan</text>

                {/* L-Tryptophan → IAA (up) */}
                <line x1="490" y1="230" x2="510" y2="174"
                    stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#pw-arrowPurple)" />

                {/* SAM */}
                <rect x="150" y="272" width="70" height="34" rx="7"
                    fill="rgba(148,163,184,0.08)" stroke="#94a3b8" strokeWidth="1.2" />
                <text x="185" y="294" textAnchor="middle" fill="#e2e8f0"
                    fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif">SAM</text>

                {/* Stress → SAM (the left external stress arrow points to SAM) */}

                {/* ACC (inside plant) */}
                <rect x="250" y="340" width="80" height="38" rx="7"
                    fill="rgba(45,212,191,0.1)" stroke="#2dd4bf" strokeWidth="1.5" />
                <text x="290" y="364" textAnchor="middle" fill="#2dd4bf"
                    fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif">ACC</text>

                {/* SAM → ACC */}
                <path d="M 185 306 L 185 350 Q 185 359 195 359 L 248 359"
                    fill="none" stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#pw-arrow)" />
                <text x="198" y="348" fill="#64748b" fontSize="8" fontFamily="Inter,sans-serif">ACS</text>

                {/* Dashed inhibition: Auxin Response Factors ─ ─ ┤ ACC */}
                <path d="M 305 194 L 305 250 Q 305 260 295 260 L 290 260 L 290 338"
                    fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#pw-flatRed)" />

                {/* Ethylene */}
                <rect x="240" y="420" width="100" height="38" rx="7"
                    fill="rgba(251,191,36,0.1)" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="290" y="444" textAnchor="middle" fill="#fbbf24"
                    fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif">Ethylene</text>

                {/* ACC → Ethylene */}
                <line x1="290" y1="378" x2="290" y2="418"
                    stroke="#fbbf24" strokeWidth="1.3" markerEnd="url(#pw-arrowYellow)" />
                <text x="305" y="402" fill="#64748b" fontSize="8" fontFamily="Inter,sans-serif">ACO</text>

                {/* Dashed: Ethylene ← ─ ─ (inhibition from Auxin Response) */}
                <path d="M 280 260 L 275 260 Q 265 260 265 270 L 265 418"
                    fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#pw-flatRed)" />

                {/* Plant Stress Response */}
                <rect x="220" y="482" width="140" height="34" rx="6"
                    fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="1.5" />
                <text x="290" y="504" textAnchor="middle" fill="#f87171"
                    fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">Plant Stress Response</text>

                {/* Ethylene → Plant Stress Response */}
                <line x1="290" y1="458" x2="290" y2="480"
                    stroke="#f87171" strokeWidth="1.3" markerEnd="url(#pw-arrowRed)" />

                {/* ═══════ CROSS-BOUNDARY (Plant ↔ Bacterium) ═══════ */}

                {/* ACC export: Plant ACC → Bacterium ACC */}
                <line x1="330" y1="359" x2="688" y2="310"
                    stroke="#2dd4bf" strokeWidth="1.3" markerEnd="url(#pw-arrowTeal)" />
                <text x="510" y="324" fill="#64748b" fontSize="8" fontFamily="Inter,sans-serif" textAnchor="middle">root exudate export</text>

                {/* IAA from Bacterium → IAA in Plant */}
                <line x1="700" y1="130" x2="545" y2="150"
                    stroke="#34d399" strokeWidth="1.3" markerEnd="url(#pw-arrowGreen)" />

                {/* L-Tryptophan: Plant → Bacterium */}
                <line x1="540" y1="246" x2="688" y2="210"
                    stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#pw-arrowPurple)" />

                {/* ═══════ INSIDE BACTERIUM ═══════ */}

                {/* IAA (bacterium produces) */}
                <rect x="700" y="105" width="60" height="34" rx="7"
                    fill="rgba(52,211,153,0.08)" stroke="#34d399" strokeWidth="1.2" />
                <text x="730" y="127" textAnchor="middle" fill="#34d399"
                    fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">IAA</text>

                {/* L-Tryptophan label in bacterium */}
                <rect x="705" y="185" width="55" height="24" rx="5"
                    fill="rgba(168,85,247,0.06)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8" />
                <text x="732" y="202" textAnchor="middle" fill="#c084fc"
                    fontSize="8.5" fontWeight="500" fontFamily="Inter,sans-serif">L-Trp</text>

                {/* L-Tryptophan → IAA (in bacterium) */}
                <path d="M 732 185 L 732 140"
                    fill="none" stroke="#a855f7" strokeWidth="1" markerEnd="url(#pw-arrowPurple)" />

                {/* ACC (in bacterium) */}
                <rect x="700" y="290" width="65" height="34" rx="7"
                    fill="rgba(45,212,191,0.1)" stroke="#2dd4bf" strokeWidth="1.2" />
                <text x="732" y="312" textAnchor="middle" fill="#2dd4bf"
                    fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">ACC</text>

                {/* ACC deaminase label */}
                <text x="790" y="360" textAnchor="middle" fill="#3b82f6"
                    fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">ACC</text>
                <text x="790" y="373" textAnchor="middle" fill="#3b82f6"
                    fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">deaminase</text>

                {/* ACC → Products (down via deaminase) */}
                <line x1="732" y1="324" x2="732" y2="400"
                    stroke="#3b82f6" strokeWidth="1.3" markerEnd="url(#pw-arrowBlue)" />

                {/* Products: Ammonia + α-ketobutyrate */}
                <rect x="680" y="405" width="160" height="40" rx="7"
                    fill="rgba(52,211,153,0.06)" stroke="#34d399" strokeWidth="1" />
                <text x="760" y="422" textAnchor="middle" fill="#34d399"
                    fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">Ammonia +</text>
                <text x="760" y="437" textAnchor="middle" fill="#34d399"
                    fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">α-ketobutyrate</text>

                {/* ═══════ ARROW MARKERS ═══════ */}
                <defs>
                    <marker id="pw-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                    </marker>
                    <marker id="pw-arrowTeal" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" />
                    </marker>
                    <marker id="pw-arrowYellow" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                    </marker>
                    <marker id="pw-arrowRed" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
                    </marker>
                    <marker id="pw-arrowBlue" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                    </marker>
                    <marker id="pw-arrowGreen" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
                    </marker>
                    <marker id="pw-arrowPurple" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                    </marker>
                    {/* Flat-head inhibition marker (─┤) */}
                    <marker id="pw-flatRed" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <line x1="8" y1="0" x2="8" y2="10" stroke="#f87171" strokeWidth="2" />
                    </marker>
                </defs>
            </svg>
            <p className="pathway-label">
                Figure 1. Complete ACC-Ethylene-PGPR pathway: Abiotic stress drives SAM → ACC → Ethylene → Plant stress response.
                PGPR bacteria degrade root-zone ACC via ACC deaminase and produce IAA to promote growth via Auxin Response Factors.
            </p>
        </div>
    );
}
