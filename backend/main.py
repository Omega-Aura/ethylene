"""
FastAPI backend for ACC-Ethylene-ACCD Mathematical Model.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from model import simulate, DEFAULT_PARAMS, DEFAULT_ICS, DEFAULT_SIM

app = FastAPI(title="ACC-Ethylene-ACCD Model API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    # Kinetic parameters (all optional — defaults used if omitted)
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

    # Initial conditions
    A_p0: Optional[float] = None
    A_r0: Optional[float] = None
    E0: Optional[float] = None
    X_b0: Optional[float] = None
    G0: Optional[float] = None

    # Simulation settings
    t_end: Optional[float] = None
    n_points: Optional[int] = None


@app.get("/api/health")
def health():
    return {"status": "ok", "model": "ACC-Ethylene-ACCD"}


@app.get("/api/defaults")
def get_defaults():
    return {"params": DEFAULT_PARAMS, "ics": DEFAULT_ICS, "sim": DEFAULT_SIM}


@app.post("/api/simulate")
def run_simulation(req: SimulationRequest):
    try:
        data = req.model_dump(exclude_none=True)

        params = {k: data[k] for k in DEFAULT_PARAMS if k in data}
        ics = {k: data[k] for k in DEFAULT_ICS if k in data}
        sim = {k: data[k] for k in DEFAULT_SIM if k in data}

        result = simulate(params, ics, sim)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
