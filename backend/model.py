"""
ACC-Ethylene-ACCD ODE Model  v2  (Extended Interaction)
========================================================
5-state ODE system solved with scipy solve_ivp (RK45).

v1 (baseline):
  ACC export from plant to root zone depends on concentration gradient.
  ACCD bacteria consume root-zone ACC only → ~18% ethylene reduction.

v2 adds three toggleable mechanisms:
  A. Enhanced ACC export  (higher k_exp)
  B. Direct bacterial sink on plant ACC  (endophytic ACCD acting on A_p)
  C. Regulatory feedback on ACS/ACO  (ethylene → ACS repression)

Modes: baseline | high_export | endophytic | feedback | custom
"""

import numpy as np
from scipy.integrate import solve_ivp


# ═══════════════════════════════════════════════════════════
#  DEFAULT PARAMETERS  (v1 baseline)
# ═══════════════════════════════════════════════════════════

DEFAULT_PARAMS = {
    # ── Plant ACC / Ethylene ──
    "v_ACS": 0.05,       # mM/h, max ACC synthesis rate
    "f_stress": 3.0,     # -, stress multiplier (1=none, 3-5=severe)
    "k_ACO": 0.30,       # 1/h, ACC oxidase rate constant
    "k_exp": 0.10,       # 1/h, ACC export permeability coefficient
    "Y_eth": 1.0,        # mol/mol, ethylene yield per ACC oxidized

    # ── ACCD Enzyme Kinetics ──
    "V_max_ACCD": 1.0,   # mM/(g*h), max ACCD Vmax per g biomass
    "K_m_ACCD": 1.5,     # mM, ACCD Km (lit: 1.5-17.4 mM)

    # ── Bacterial Growth (Monod) ──
    "mu_max": 0.15,      # 1/h, max bacterial specific growth rate
    "K_s": 0.1,          # mM, Monod half-saturation
    "k_d": 0.01,         # 1/h, bacterial decay rate

    # ── Volumes & Greenhouse ──
    "Vp_Vr": 0.10,       # ratio, plant tissue vol / root zone vol
    "Vp_Vair": 0.001,    # ratio, plant tissue vol / air vol
    "k_vent": 0.50,      # 1/h, ventilation rate
    "k_scrub": 0.0,      # 1/h, chemical scrubber rate
    "k_loss": 0.01,      # 1/h, non-enzymatic ACC loss in root zone

    # ── Plant Growth Index ──
    "r_g": 0.02,         # 1/h, intrinsic plant growth rate
    "K_E": 0.0001,       # uM, ethylene IC50 for 50% growth inhibition
    "n_hill": 2.0,       # -, Hill coefficient

    # ═══ v2 EXTENSIONS ═══

    # ── Feature B: Direct Bacterial Sink (Endophytic) ──
    "f_direct": 0.0,             # 0-1, fraction of Xb acting directly on A_p
    "V_max_ACCD_direct": 1.0,    # mM/(g*h), Vmax for direct plant-side ACCD
    "K_m_ACCD_direct": 1.5,      # mM, Km for direct plant-side ACCD

    # ── Feature C: Regulatory Feedback on ACS ──
    "fb_enable": 0,      # 0 or 1 (treated as bool)
    "K_fb": 5e-5,        # M (ethylene level for 50% ACS repression)
    "n_fb": 2.0,         # Hill coefficient for feedback

    # ── Feature C (optional): Feedback on ACO ──
    "aco_fb_enable": 0,  # 0 or 1
    "K_fb_aco": 5e-5,    # M
    "n_fb_aco": 2.0,     # Hill coefficient for ACO feedback
}


DEFAULT_ICS = {
    "A_p0": 0.01,
    "A_r0": 0.0,
    "E0": 0.0,
    "X_b0": 0.5,
    "G0": 1.0,
}

DEFAULT_SIM = {
    "t_end": 120.0,
    "n_points": 2000,
}


# ═══════════════════════════════════════════════════════════
#  MODE PRESETS
# ═══════════════════════════════════════════════════════════

MODE_PRESETS = {
    "baseline": {
        # v1 defaults — no overrides needed
    },
    "high_export": {
        "k_exp": 0.45,  # much higher than k_ACO=0.3 → >50% ACC flux to root zone
    },
    "endophytic": {
        "f_direct": 0.5,
        "V_max_ACCD_direct": 1.0,
        "K_m_ACCD_direct": 1.5,
    },
    "feedback": {
        "fb_enable": 1,
        "K_fb": 2e-4,
        "n_fb": 3.0,
    },
}


# ═══════════════════════════════════════════════════════════
#  ODE RIGHT-HAND SIDE  (v2)
# ═══════════════════════════════════════════════════════════

def ode_rhs(t, y, p):
    """Right-hand side of the 5-state ODE system (v2)."""
    Ap, Ar, E, Xb, G = [max(v, 0.0) for v in y]

    # ── Regulatory feedback on ACS (Feature C) ──
    fb_factor = 1.0
    if p["fb_enable"]:
        K_fb = max(p["K_fb"], 1e-20)
        n_fb = p["n_fb"]
        fb_factor = 1.0 / (1.0 + (E / K_fb) ** n_fb)

    # ── Regulatory feedback on ACO (Feature C, optional) ──
    k_ACO_eff = p["k_ACO"]
    if p["aco_fb_enable"]:
        K_fb_aco = max(p["K_fb_aco"], 1e-20)
        n_fb_aco = p["n_fb_aco"]
        aco_fb = 1.0 / (1.0 + (E / K_fb_aco) ** n_fb_aco)
        k_ACO_eff = p["k_ACO"] * aco_fb

    # ── ACS rate (with optional feedback) ──
    v_ACS = p["v_ACS"] * p["f_stress"] * fb_factor

    # ── ACC export: gradient-driven ──
    Ar_plant_eq = Ar / p["Vp_Vr"] if p["Vp_Vr"] > 0 else 0.0
    net_export = p["k_exp"] * max(Ap - Ar_plant_eq, 0.0)

    # ── Feature B: Direct bacterial sink on plant ACC (endophytic) ──
    f_dir = max(0.0, min(1.0, p["f_direct"]))
    Xb_direct = f_dir * Xb
    Xb_rhizo = (1.0 - f_dir) * Xb

    v_bact_p = 0.0
    if f_dir > 0 and Xb_direct > 0:
        v_bact_p = Xb_direct * (p["V_max_ACCD_direct"] * Ap / (p["K_m_ACCD_direct"] + Ap))

    # ── Eq 1: Plant intracellular ACC  (v2) ──
    dAp = v_ACS - k_ACO_eff * Ap - net_export - v_bact_p

    # ── Eq 2: Root-zone ACC  (v2: uses Xb_rhizo) ──
    accd = (p["V_max_ACCD"] * Ar / (p["K_m_ACCD"] + Ar)) * Xb_rhizo
    dAr = net_export * p["Vp_Vr"] - accd - p["k_loss"] * Ar

    # ── Eq 3: Ethylene in greenhouse air ──
    dE = p["Y_eth"] * k_ACO_eff * Ap * p["Vp_Vair"] - p["k_vent"] * E - p["k_scrub"] * E

    # ── Eq 4: Bacterial biomass (Monod on Ar, full Xb) ──
    mu = p["mu_max"] * Ar / (p["K_s"] + Ar)
    dXb = mu * Xb - p["k_d"] * Xb

    # ── Eq 5: Plant growth (Hill inhibition by ethylene) ──
    Es = max(E, 1e-15)
    f_growth = p["K_E"] ** p["n_hill"] / (p["K_E"] ** p["n_hill"] + Es ** p["n_hill"])
    dG = p["r_g"] * f_growth

    return [dAp, dAr, dE, dXb, dG]


# ═══════════════════════════════════════════════════════════
#  SOLVER
# ═══════════════════════════════════════════════════════════

def run_scenario(params: dict, y0: list, t_end: float, n_points: int):
    """Run one ODE scenario and return (times, states) as lists."""
    t_eval = np.linspace(0, t_end, n_points)
    sol = solve_ivp(
        ode_rhs,
        (0, t_end),
        y0,
        args=(params,),
        t_eval=t_eval,
        method="RK45",
        max_step=0.1,
        rtol=1e-8,
        atol=1e-10,
    )
    if not sol.success:
        raise RuntimeError(f"Solver failed: {sol.message}")
    return sol.t.tolist(), sol.y.tolist()  # y shape: (5, n_points)


# ═══════════════════════════════════════════════════════════
#  KPIs
# ═══════════════════════════════════════════════════════════

def compute_kpis(t_ctrl, y_ctrl, t_accd, y_accd, params):
    """Compute key performance indicators comparing control vs ACCD."""
    E_ctrl = np.array(y_ctrl[2])
    E_accd = np.array(y_accd[2])

    peak_ctrl = float(np.max(E_ctrl))
    peak_accd = float(np.max(E_accd))
    t_peak_ctrl = float(t_ctrl[int(np.argmax(E_ctrl))])
    t_peak_accd = float(t_accd[int(np.argmax(E_accd))])

    ss_ctrl = float(E_ctrl[-1])
    ss_accd = float(E_accd[-1])

    reduction_peak = (1 - peak_accd / peak_ctrl) * 100 if peak_ctrl > 0 else 0
    reduction_ss = (1 - ss_accd / ss_ctrl) * 100 if ss_ctrl > 0 else 0

    growth_ctrl = float(y_ctrl[4][-1])
    growth_accd = float(y_accd[4][-1])
    growth_improve = ((growth_accd - growth_ctrl) / growth_ctrl * 100) if growth_ctrl > 0 else 0

    # Flux ratio: k_exp / (k_exp + k_ACO) — theoretical max export fraction
    k_exp = params.get("k_exp", 0.1)
    k_ACO = params.get("k_ACO", 0.3)
    export_fraction = k_exp / (k_exp + k_ACO) * 100 if (k_exp + k_ACO) > 0 else 0

    # Active mechanisms
    active_mechanisms = []
    if k_exp > 0.15:
        active_mechanisms.append("high_export")
    if params.get("f_direct", 0) > 0:
        active_mechanisms.append("endophytic")
    if params.get("fb_enable", 0):
        active_mechanisms.append("feedback")

    return {
        "peakCtrl": round(peak_ctrl, 8),
        "peakACCD": round(peak_accd, 8),
        "tPeakCtrl": round(t_peak_ctrl, 2),
        "tPeakACCD": round(t_peak_accd, 2),
        "reductionPeakPct": round(reduction_peak, 2),
        "ssCtrl": round(ss_ctrl, 8),
        "ssACCD": round(ss_accd, 8),
        "reductionSSPct": round(reduction_ss, 2),
        "growthCtrl": round(growth_ctrl, 6),
        "growthACCD": round(growth_accd, 6),
        "growthImprovePct": round(growth_improve, 2),
        "exportFractionPct": round(export_fraction, 2),
        "activeMechanisms": active_mechanisms,
    }


# ═══════════════════════════════════════════════════════════
#  MAIN SIMULATE ENTRY POINT
# ═══════════════════════════════════════════════════════════

def simulate(params: dict, ics: dict, sim: dict, mode: str = "baseline"):
    """
    Run control + ACCD scenarios, return full result dict.

    Resolution order:
      1. Load DEFAULT_PARAMS
      2. Apply MODE_PRESETS[mode] overrides
      3. Apply explicit `params` overrides from the request body
    """
    # 1. Start with defaults
    p = {**DEFAULT_PARAMS}

    # 2. Apply mode preset
    if mode in MODE_PRESETS:
        p.update(MODE_PRESETS[mode])

    # 3. Apply user overrides
    p.update(params)

    ic = {**DEFAULT_ICS, **ics}
    s = {**DEFAULT_SIM, **sim}

    # Control scenario: no bacteria (Xb0 = 0)
    y0_ctrl = [ic["A_p0"], ic["A_r0"], ic["E0"], 0.0, ic["G0"]]
    # ACCD scenario: bacteria present
    y0_accd = [ic["A_p0"], ic["A_r0"], ic["E0"], ic["X_b0"], ic["G0"]]

    t_ctrl, y_ctrl = run_scenario(p, y0_ctrl, s["t_end"], s["n_points"])
    t_accd, y_accd = run_scenario(p, y0_accd, s["t_end"], s["n_points"])

    kpis = compute_kpis(t_ctrl, y_ctrl, t_accd, y_accd, p)

    # Downsample for JSON response (max 500 points)
    n = len(t_ctrl)
    step = max(1, n // 500)
    idx = list(range(0, n, step))
    if idx[-1] != n - 1:
        idx.append(n - 1)

    def pick(arr, indices):
        return [round(arr[i], 10) for i in indices]

    time_series = {
        "time": pick(t_ctrl, idx),
        "ctrl": {
            "Ap": pick(y_ctrl[0], idx),
            "Ar": pick(y_ctrl[1], idx),
            "E": pick(y_ctrl[2], idx),
            "Xb": pick(y_ctrl[3], idx),
            "G": pick(y_ctrl[4], idx),
        },
        "accd": {
            "Ap": pick(y_accd[0], idx),
            "Ar": pick(y_accd[1], idx),
            "E": pick(y_accd[2], idx),
            "Xb": pick(y_accd[3], idx),
            "G": pick(y_accd[4], idx),
        },
    }

    return {"kpis": kpis, "timeSeries": time_series, "params": p, "mode": mode}
