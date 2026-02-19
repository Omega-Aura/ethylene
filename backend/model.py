"""
ACC-Ethylene-ACCD ODE Model
============================
5-state ODE system solved with scipy solve_ivp (RK45).

Key mechanism: ACC export from plant to root zone depends on the
concentration gradient (Ap - Ar/Vp_Vr_eq). When ACCD bacteria consume
root-zone ACC, the gradient steepens, increasing net export. This lowers
plant intracellular ACC, reducing ethylene production and relieving
growth inhibition.
"""

import numpy as np
from scipy.integrate import solve_ivp


DEFAULT_PARAMS = {
    "v_ACS": 0.05,       # mM/h, max ACC synthesis rate
    "f_stress": 3.0,     # -, stress multiplier (1=none, 3-5=severe)
    "k_ACO": 0.30,       # 1/h, ACC oxidase rate constant
    "k_exp": 0.10,       # 1/h, ACC export permeability coefficient
    "Y_eth": 1.0,        # mol/mol, ethylene yield per ACC oxidized
    "V_max_ACCD": 1.0,   # mM/(g*h), max ACCD Vmax per g biomass
    "K_m_ACCD": 1.5,     # mM, ACCD Km (lit: 1.5-17.4 mM, low end for high-affinity strains)
    "mu_max": 0.15,      # 1/h, max bacterial specific growth rate
    "K_s": 0.1,          # mM, Monod half-saturation (ACC as sole N/C source, low Ks)
    "k_d": 0.01,         # 1/h, bacterial decay rate
    "Vp_Vr": 0.10,       # ratio, plant tissue vol / root zone vol
    "Vp_Vair": 0.001,    # ratio, plant tissue vol / air vol
    "k_vent": 0.50,      # 1/h, ventilation rate
    "k_scrub": 0.0,      # 1/h, chemical scrubber rate
    "k_loss": 0.01,      # 1/h, non-enzymatic ACC loss in root zone
    "r_g": 0.02,         # 1/h, intrinsic plant growth rate
    "K_E": 0.0001,       # uM, ethylene IC50 for 50% growth inhibition
    "n_hill": 2.0,       # -, Hill coefficient
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


def ode_rhs(t, y, p):
    """Right-hand side of the 5-state ODE system."""
    Ap, Ar, E, Xb, G = [max(v, 0.0) for v in y]

    # ACC export: gradient-driven (net flux from plant to root zone)
    # v_export = k_exp * (Ap - Ar * Vr/Vp) where Vr/Vp = 1/Vp_Vr
    # When ACCD lowers Ar, gradient increases -> more export -> lower Ap
    Ar_plant_eq = Ar / p["Vp_Vr"] if p["Vp_Vr"] > 0 else 0.0
    net_export = p["k_exp"] * max(Ap - Ar_plant_eq, 0.0)

    # Eq 1: Plant intracellular ACC
    dAp = p["v_ACS"] * p["f_stress"] - p["k_ACO"] * Ap - net_export

    # Eq 2: Root-zone ACC (export scaled by volume ratio)
    accd = (p["V_max_ACCD"] * Ar / (p["K_m_ACCD"] + Ar)) * Xb
    dAr = net_export * p["Vp_Vr"] - accd - p["k_loss"] * Ar

    # Eq 3: Ethylene in greenhouse air
    dE = p["Y_eth"] * p["k_ACO"] * Ap * p["Vp_Vair"] - p["k_vent"] * E - p["k_scrub"] * E

    # Eq 4: Bacterial biomass (Monod)
    mu = p["mu_max"] * Ar / (p["K_s"] + Ar)
    dXb = mu * Xb - p["k_d"] * Xb

    # Eq 5: Plant growth — spec: dG/dt = r_g * f(C_E)
    # f(C_E) = 1 / (1 + (C_E/C_50)^n) = K_E^n / (K_E^n + E^n)
    Es = max(E, 1e-15)
    f_growth = p["K_E"] ** p["n_hill"] / (p["K_E"] ** p["n_hill"] + Es ** p["n_hill"])
    dG = p["r_g"] * f_growth

    return [dAp, dAr, dE, dXb, dG]


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


def compute_kpis(t_ctrl, y_ctrl, t_accd, y_accd):
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
    }


def simulate(params: dict, ics: dict, sim: dict):
    """Run control + ACCD scenarios, return full result dict."""
    p = {**DEFAULT_PARAMS, **params}
    ic = {**DEFAULT_ICS, **ics}
    s = {**DEFAULT_SIM, **sim}

    y0_ctrl = [ic["A_p0"], ic["A_r0"], ic["E0"], 0.0, ic["G0"]]
    y0_accd = [ic["A_p0"], ic["A_r0"], ic["E0"], ic["X_b0"], ic["G0"]]

    t_ctrl, y_ctrl = run_scenario(p, y0_ctrl, s["t_end"], s["n_points"])
    t_accd, y_accd = run_scenario(p, y0_accd, s["t_end"], s["n_points"])

    kpis = compute_kpis(t_ctrl, y_ctrl, t_accd, y_accd)

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

    return {"kpis": kpis, "timeSeries": time_series, "params": p}
