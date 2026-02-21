"""
FastAPI backend for ACC-Ethylene-ACCD Mathematical Model v2.

Adds support for:
  - `mode` field: "baseline" | "high_export" | "endophytic" | "feedback" | "custom"
  - New v2 parameters: f_direct, V_max_ACCD_direct, K_m_ACCD_direct,
    fb_enable, K_fb, n_fb, aco_fb_enable, K_fb_aco, n_fb_aco
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from model import simulate, DEFAULT_PARAMS, DEFAULT_ICS, DEFAULT_SIM, MODE_PRESETS

app = FastAPI(title="ACC-Ethylene-ACCD Model API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    # ── Mode selector (v2) ──
    mode: Optional[str] = None  # baseline | high_export | endophytic | feedback | custom

    # ── Kinetic parameters (all optional — defaults used if omitted) ──
    v_ACS: Optional[float] = None
    f_stress: Optional[float] = None
    k_ACO: Optional[float] = None
    k_exp: Optional[float] = None
    Y_eth: Optional[float] = None
    V_max_ACCD: Optional[float] = None
    K_m_ACCD: Optional[float] = None
    mu_max: Optional[float] = None
    K_s: Optional[float] = None
    k_d: Optional[float] = None
    Vp_Vr: Optional[float] = None
    Vp_Vair: Optional[float] = None
    k_vent: Optional[float] = None
    k_scrub: Optional[float] = None
    k_loss: Optional[float] = None
    r_g: Optional[float] = None
    K_E: Optional[float] = None
    n_hill: Optional[float] = None

    # ── v2: Feature B — Direct Bacterial Sink (Endophytic) ──
    f_direct: Optional[float] = None
    V_max_ACCD_direct: Optional[float] = None
    K_m_ACCD_direct: Optional[float] = None

    # ── v2: Feature C — Regulatory Feedback on ACS ──
    fb_enable: Optional[int] = None   # 0 or 1
    K_fb: Optional[float] = None
    n_fb: Optional[float] = None

    # ── v2: Feature C (optional) — Feedback on ACO ──
    aco_fb_enable: Optional[int] = None
    K_fb_aco: Optional[float] = None
    n_fb_aco: Optional[float] = None

    # ── Initial conditions ──
    A_p0: Optional[float] = None
    A_r0: Optional[float] = None
    E0: Optional[float] = None
    X_b0: Optional[float] = None
    G0: Optional[float] = None

    # ── Simulation settings ──
    t_end: Optional[float] = None
    n_points: Optional[int] = None


@app.get("/api/health")
def health():
    return {"status": "ok", "model": "ACC-Ethylene-ACCD v2", "version": "2.0.0"}


@app.get("/api/defaults")
def get_defaults():
    return {
        "params": DEFAULT_PARAMS,
        "ics": DEFAULT_ICS,
        "sim": DEFAULT_SIM,
        "modes": list(MODE_PRESETS.keys()),
        "mode_presets": MODE_PRESETS,
    }


@app.post("/api/simulate")
def run_simulation(req: SimulationRequest):
    try:
        data = req.model_dump(exclude_none=True)

        # Extract mode
        mode = data.pop("mode", "baseline")

        # Separate params, ics, sim
        params = {k: data[k] for k in DEFAULT_PARAMS if k in data}
        ics = {k: data[k] for k in DEFAULT_ICS if k in data}
        sim = {k: data[k] for k in DEFAULT_SIM if k in data}

        result = simulate(params, ics, sim, mode=mode)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
