# 🌱 ACC-Ethylene-ACCD Mathematical Model

> Interactive ODE simulation of how PGPR bacteria with ACC deaminase reduce plant stress ethylene and promote growth.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 About

Plants under abiotic stress (drought, salinity, flooding) overproduce the hormone **ethylene** via the ACC pathway, which inhibits root elongation and overall growth. Certain soil bacteria — **Plant Growth-Promoting Rhizobacteria (PGPR)** — express the enzyme **ACC deaminase (ACCD)**, which cleaves the ethylene precursor **ACC** in the root zone, lowering ethylene levels and rescuing plant growth.

This application models that interaction as a **5-state ODE system** and lets you simulate it interactively in your browser.

---

## 🧬 The Model

### Five State Variables

| # | Variable | Symbol | Description |
|---|----------|--------|-------------|
| 1 | Plant ACC | $A_p$ | Intracellular ACC concentration in plant tissue (mM) |
| 2 | Root-zone ACC | $A_r$ | Extracellular ACC in the rhizosphere (mM) |
| 3 | Ethylene | $C_E$ | Gas-phase ethylene concentration in greenhouse air (µM) |
| 4 | Bacterial Biomass | $X_b$ | PGPR dry cell weight in root zone (g DCW/L) |
| 5 | Plant Growth Index | $G$ | Dimensionless growth metric (starts at 1.0) |

### ODE System

**Eq 1 — Plant ACC**
$$\frac{dA_p}{dt} = V_{ACS} \cdot f_{stress} - k_{ACO} \cdot A_p - v_{export}$$

**Eq 2 — Root-zone ACC**
$$\frac{dA_r}{dt} = v_{export} \cdot \frac{V_p}{V_r} - \frac{V_{max}^{ACCD} \cdot A_r}{K_m^{ACCD} + A_r} \cdot X_b - k_{loss} \cdot A_r$$

**Eq 3 — Ethylene**
$$\frac{dC_E}{dt} = \frac{Y_E \cdot k_{ACO} \cdot A_p \cdot V_p}{V_{air}} - (k_{vent} + k_{scrub}) \cdot C_E$$

**Eq 4 — Bacterial Biomass (Monod)**
$$\frac{dX_b}{dt} = \frac{\mu_{max} \cdot A_r}{K_s + A_r} \cdot X_b - k_d \cdot X_b$$

**Eq 5 — Plant Growth (Hill Inhibition)**
$$\frac{dG}{dt} = r_g \cdot \frac{1}{1 + (C_E / K_E)^n}$$

### Key Mechanism

ACC export from the plant to the root zone is **gradient-driven**:

$$v_{export} = k_{exp} \cdot \max\left(A_p - \frac{A_r}{V_p/V_r}, \ 0\right)$$

When ACCD bacteria consume root-zone ACC ($A_r$ ↓), the gradient steepens → more ACC is exported from the plant → plant $A_p$ drops → less ethylene is produced → growth inhibition is relieved.

---

## ✨ Features

- **Side-by-side Comparison** — Runs two parallel simulations: Control (no bacteria) vs. ACCD-inoculated
- **20+ Tunable Parameters** — Grouped into 6 categories with literature-based defaults and units
- **4 Interactive Charts** — Ethylene, Root-zone ACC, Bacterial Biomass, and Plant Growth Index over time
- **KPI Dashboard** — Peak/steady-state ethylene reduction (%) and growth improvement (%)
- **CSV Export** — Download full time-series data and parameter sets
- **Premium Dark UI** — Glassmorphism cards, smooth animations, responsive layout

---

## 🏗️ Project Structure

```
ACC Math Model/
├── README.md
├── .gitignore
│
├── backend/                    # Python API
│   ├── main.py                 # FastAPI server, /api/simulate endpoint
│   ├── model.py                # 5-state ODE system (scipy solve_ivp, RK45)
│   └── requirements.txt       # fastapi, uvicorn, scipy, numpy
│
└── frontend/                   # React SPA
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx            # Entry point
        ├── App.jsx             # Main layout, API calls, pathway diagram
        ├── App.css             # Dark theme, glassmorphism, responsive
        └── components/
            ├── ParamForm.jsx   # 6-card parameter input form
            ├── KPICards.jsx    # 8 performance indicator cards
            ├── Charts.jsx     # 4 Recharts line charts
            └── DataTable.jsx  # Paginated table + CSV download
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm

### 1. Clone the Repository

```bash
git clone https://github.com/Omega-Aura/ethylene.git
cd ethylene
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. You can check `http://localhost:8000/api/health` to verify.

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser and click **▶ Run Simulation**.

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/defaults` | Returns all default parameters, ICs, and simulation settings |
| `POST` | `/api/simulate` | Runs the ODE solver. Accepts JSON body with optional parameter overrides. Returns KPIs + time-series data |

**Example request:**

```bash
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"f_stress": 5.0, "t_end": 240}'
```

---

## 🔬 Default Parameters

| Parameter | Value | Unit | Description |
|-----------|-------|------|-------------|
| `v_ACS` | 0.05 | mM/h | Max ACC synthase rate |
| `f_stress` | 3.0 | — | Stress multiplier (1 = none, 3–5 = severe) |
| `k_ACO` | 0.30 | 1/h | ACC oxidase rate constant |
| `k_exp` | 0.10 | 1/h | ACC export permeability |
| `V_max_ACCD` | 1.0 | mM/(g·h) | Max ACCD activity per g biomass |
| `K_m_ACCD` | 1.5 | mM | ACCD Michaelis constant (lit: 1.5–17.4 mM) |
| `mu_max` | 0.15 | 1/h | Max bacterial growth rate |
| `K_s` | 0.1 | mM | Monod half-saturation |
| `k_d` | 0.01 | 1/h | Bacterial decay rate |
| `r_g` | 0.02 | 1/h | Intrinsic plant growth rate |
| `K_E` | 0.0001 | µM | Ethylene IC₅₀ for growth inhibition |
| `n_hill` | 2.0 | — | Hill coefficient |

---

## 📊 Expected Results (Default Parameters)

| Metric | Value |
|--------|-------|
| Steady-state ethylene reduction | **~18.6%** |
| Peak ethylene reduction | **~18.1%** |
| Plant growth improvement | **~6.8%** |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Solver** | SciPy `solve_ivp` (RK45) | Numerical ODE integration |
| **API** | FastAPI + Uvicorn | High-performance async REST API |
| **Frontend** | React 19 + Vite 7 | Modern SPA with HMR |
| **Charts** | Recharts | Interactive, composable line charts |
| **Styling** | Vanilla CSS | Custom dark theme with glassmorphism |

---

## 📄 License

This project is part of the [Omega-Aura iGEM](https://github.com/Omega-Aura) initiative.
