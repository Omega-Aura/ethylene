<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# so make a PRD to update the existing model.

The updated PRD should extend your current ACC–ethylene–ACCD model with **three optional mechanisms** that can, in principle, give >50 % ethylene reduction while keeping the original conservative baseline intact.[^1][^2]

***

# PRODUCT REQUIREMENTS DOCUMENT

## ACC–Ethylene–ACCD Model v2 (Extended Interaction)

### 0. Context

Current model (v1) implements a 5‑state ODE system (Ap, Ar, CE, Xb, G) where ACC deaminase‑producing bacteria consume **root‑zone ACC only**. With literature‑based parameters, this yields ≈18 % peak ethylene reduction versus control, consistent with the fact that only ~25 % of ACC flux is exported from plant tissue in the model.[^3][^4][^1]

v2 will add **optional mechanisms** that represent stronger plant–microbe interaction, allowing the model to explore scenarios where ethylene reduction exceeds 50 % in a mathematically and biologically defensible way.

***

## 1. Goals and Non‑Goals

### 1.1 Goals

1. **Retain v1 as the default “conservative” mode** (export‑only ACCD), still giving ≈18 % reduction for the published default parameters.[^4][^1]
2. Add three *toggleable* extensions:
    - **A. Enhanced ACC export** (higher k_exp relative to k_ACO).
    - **B. Direct bacterial sink on plant ACC (ACC\_p)**.
    - **C. Ethylene/ACC feedback on ACS/ACO activity.**
3. Provide clear **scenario presets** (Baseline, High‑Export, Endophytic, Feedback) for iGEM figures and interactive demo.
4. Ensure **backward compatibility** of the API (`/api/simulate`) and parameter files.

### 1.2 Non‑Goals

- No change to the **core pathway** (still only ACC → ethylene; no EMO or other ethylene‑degrading enzymes).
- No spatial PDEs or complex multi‑layer biofilm models; compartmental ODEs only.
- No claim that >50 % reduction is the default or guaranteed in real plants—these are *design / “what‑if”* scenarios.

***

## 2. Baseline Model (v1) Recap

State variables (unchanged):[^1]

- $A_p$: plant ACC (mM).
- $A_r$: root‑zone ACC (mM).
- $C_E$: ethylene in air (M).
- $X_b$: bacterial biomass (g DCW/L).
- $G$: plant growth index.

Key v1 equations (simplified):[^2][^1]

1. Plant ACC:

$$
\frac{dA_p}{dt} = v_{\text{ACS}} - k_{\text{ACO}}A_p - v_{\text{export}}
$$

2. Root‑zone ACC:

$$
\frac{dA_r}{dt} = \frac{v_{\text{export}} V_p}{V_r} - v_{\text{ACCD}} - k_{\text{loss}}A_r
$$

3. Ethylene:

$$
\frac{dC_E}{dt} = Y_{\text{eth}} k_{\text{ACO}} A_p \frac{V_p}{V_{\text{air}}} - k_{\text{vent}}C_E - k_{\text{scrub}}C_E
$$

4. Bacteria (Monod on $A_r$) and growth index as in README.[^1]

Where:

- $v_{\text{ACS}} = v_{\text{ACS,max}} f_{\text{stress}}$.
- $v_{\text{export}} = k_{\text{exp}} (A_p - A_r V_p / V_r)_+$.
- $v_{\text{ACCD}} = X_b \dfrac{V_{\max}^{\text{ACCD}} A_r}{K_m^{\text{ACCD}} + A_r}$.[^2][^1]

With $k_{\text{ACO}} = 0.3\ \text{h}^{-1}$, $k_{\text{exp}} = 0.1\ \text{h}^{-1}$, only 25 % of ACC flux is available to bacteria, so max theoretical ethylene reduction ≈25 %; simulation gives ≈18 %.[^3][^4]

***

## 3. New Feature A – Enhanced ACC Export Scenario

### 3.1 Rationale

Literature shows ACC can be transported and accumulated in xylem, phloem, and root exudates, and this distribution changes with stress and microbial colonization. To explore strong ACC leakage to the rhizosphere, v2 introduces a **scenario where k_exp is comparable to or larger than k_ACO**.[^5][^6][^7]

### 3.2 Requirements

- Keep the same export equation:

$$
v_{\text{export}} = k_{\text{exp}} (A_p - A_r V_p/V_r)_+
$$

- Introduce **scenario presets**:
    - `mode = "baseline"` (current defaults, k_exp = 0.1 h⁻¹).
    - `mode = "high_export"` (e.g. k_exp default 0.3–0.6 h⁻¹).
- API: `/api/simulate` accepts optional `"mode"` string and/or explicit `"kexp"` override.


### 3.3 Expected behavior

- With `high_export` and sufficiently large $V_{\max}^{\text{ACCD}} X_b$, **peak ethylene reduction can exceed 50 %** because >50 % of ACC flux is routed through the bacterial‑accessible pool.
- README update: clearly label this as a **“strong root exudation / high export” design scenario**, citing ACC transport literature.[^8][^5]

***

## 4. New Feature B – Direct Bacterial Sink on Plant ACC (Endophytic Scenario)

### 4.1 Rationale

Many ACCD‑producing PGPR and fungi colonize the rhizoplane or internal tissues, effectively competing with plant ACC oxidase for ACC inside or very near the tissue compartment. To capture this, v2 adds a **direct ACCD sink on $A_p$**.[^9][^10][^11][^12]

### 4.2 Model Changes

Introduce a new parameter:

- `f_direct` (0–1): **fraction of bacterial ACCD that directly acts on plant‑side ACC**.

Split total bacterial biomass:

- $X_b^{\text{direct}} = f_{\text{direct}} X_b$
- $X_b^{\text{rhizo}} = (1 - f_{\text{direct}}) X_b$

Redefine:

1. **New direct plant‑side ACCD term:**

$$
v_{\text{bact,p}} = X_b^{\text{direct}} \cdot \frac{V_{\max,\text{direct}}^{\text{ACCD}} A_p}{K_{m,\text{direct}}^{\text{ACCD}} + A_p}
$$

2. Modify plant ACC equation:

$$
\frac{dA_p}{dt} = v_{\text{ACS}} - k_{\text{ACO}}A_p - v_{\text{export}} - v_{\text{bact,p}}
$$

3. Root‑zone ACCD term uses $X_b^{\text{rhizo}}$:

$$
v_{\text{ACCD}} = X_b^{\text{rhizo}} \cdot \frac{V_{\max}^{\text{ACCD}} A_r}{K_m^{\text{ACCD}} + A_r}
$$

### 4.3 Parameters

New parameters to add to `acc_model_parameters.csv` and API:[^3]

- `f_direct` (default 0.0 baseline; 0.3–0.7 for “endophytic” scenario).
- `VmaxACCD_direct` (mM g⁻¹ h⁻¹) – can default equal to `VmaxACCD`.
- `KmACCD_direct` (mM) – default same as `KmACCD`.


### 4.4 Expected behavior

- With moderate `f_direct` and high `VmaxACCD_direct`, bacteria now compete directly with ACO for ACC\_p, so **fraction of ACC going to ethylene drops below 50 %** even if k_exp remains small.
- Provide a preset:
    - `mode = "endophytic"` → set `f_direct = 0.5`, other values tuned so that peak ethylene reduction ≈50–60 % in simulations, documented as a “strongly root‑associated/endophytic” design case.

***

## 5. New Feature C – Regulatory Feedback on ACS/ACO

### 5.1 Rationale

Ethylene biosynthesis is regulated at multiple levels; ethylene and ACC themselves influence ACS/ACO gene expression and stability. PGPR with ACCD have been shown to modulate *ACS*/*ACO* transcript levels in stressed plants. To reflect this, v2 introduces **simple negative feedback** from ethylene to ACS (and optionally ACO).[^10][^11][^13][^14][^15][^16][^9]

### 5.2 Model Changes

#### 5.2.1 Feedback on ACS

Replace constant $v_{\text{ACS}}$ with:

$$
v_{\text{ACS}} = v_{\text{ACS,max}} f_{\text{stress}} \cdot f_{\text{fb}}(C_E)
$$

with:

$$
f_{\text{fb}}(C_E) = \frac{1}{1 + \left(\frac{C_E}{K_{\text{fb}}}\right)^{n_{\text{fb}}}}
$$

New parameters:

- `Kfb` – ethylene level where ACS is at 50 % of maximal (M).
- `nfb` – Hill coefficient (dimensionless, 1–4).
- `fb_enable` – boolean/toggle.


#### 5.2.2 Optional feedback on ACO

Optionally (lower priority), allow:

$$
k_{\text{ACO}} = k_{\text{ACO,base}} \cdot g(C_E)
$$

with e.g. a similar decreasing Hill function `g(C_E)`; expose as `aco_fb_enable`.

### 5.3 Expected behavior

- In feedback‑enabled mode, **any initial reduction in ethylene by ACCD leads to a secondary decrease in ACS rate**, reducing ACC production and long‑term ethylene levels beyond the direct sink effect.
- Preset:
    - `mode = "feedback"` – `fb_enable = true`, tuned `Kfb` so that under control (no bacteria) ACS is partially upregulated, and under ACCD treatment ACS is significantly repressed; target >50 % ethylene reduction for illustration.
- README must be explicit: this mode represents **regulatory effects** documented in ethylene biosynthesis literature, not just enzymatic ACCD action alone.[^13][^14][^17]

***

## 6. API \& Parameter Schema Changes

### 6.1 New JSON fields for `/api/simulate`

- `mode` (string, optional): `"baseline" | "high_export" | "endophytic" | "feedback" | "custom"`.
- `f_direct` (float, 0–1).
- `VmaxACCD_direct`, `KmACCD_direct` (floats).
- `fb_enable` (bool).
- `Kfb`, `nfb` (floats).

Backend logic:

1. Load defaults from `acc_model_parameters.csv`.
2. Apply `mode` preset overrides.
3. Apply any explicit field overrides from request body.

### 6.2 CSV / README updates

- Extend `acc_model_parameters.csv` with new rows and descriptions.
- Update README “The Model” section with:
    - New terms in equations for v2.
    - Explanation of modes and biological interpretation.[^1]

***

## 7. Frontend / UX Requirements

1. **Mode selector** dropdown:
    - “Conservative (export‑only)” – maps to `baseline`.
    - “High ACC export (rhizosphere)” – `high_export`.
    - “Endophytic ACCD (direct sink)” – `endophytic`.
    - “Regulatory feedback (ACS/ACO)” – `feedback`.
2. **Visual indication** (e.g., colored badge) of which mechanisms are active.
3. **Comparison charts**:
    - Always show **Control vs Selected Mode** (as currently) plus a small annotation with % peak and steady‑state reduction.
4. **KPI panel** extended to show:
    - Peak ethylene reduction (%).
    - Steady‑state ethylene reduction (%).
    - Flag when theoretical export fraction limit is exceeded (e.g., tooltip explaining flux ratios for teaching).

***

## 8. Validation Plan

### 8.1 Unit Tests

- Baseline (`mode=baseline`) reproduces existing KPIs within tolerance (±0.5 % for peak reduction).[^4]
- For `f_direct=0`, `fb_enable=false`, v2 equations reduce exactly to v1.


### 8.2 Scenario Sanity Checks

- `high_export`: With k_exp >> k_ACO, and large ACCD capacity, simulated ethylene reduction approaches the theoretical export fraction limit (k_exp/(k_exp+k_ACO)).
- `endophytic`: Increasing `f_direct` from 0 → 0.7 monotonically increases ethylene reduction.
- `feedback`: Turning `fb_enable` on with reasonable `Kfb` reduces ACS rate over time and gives additional ethylene suppression beyond export/direct‑sink effects.


### 8.3 Biological Plausibility Review

- Cross‑check parameter ranges and qualitative behaviors with ACC transport and ACS/ACO regulation reviews.[^7][^14][^5][^13]
- Document in wiki and README that modes >baseline are **hypothesis/design explorations**, not yet experimentally validated.

***

## 9. Deliverables

1. **Updated model implementation** (`backend/model.py`) with new terms and modes.
2. **Updated README.md** with:
    - v1 vs v2 diagram.
    - Equation tables for each added mechanism.[^1]
    - Biological justification and citations.
3. **Updated parameter CSV** with new fields and comments.[^3]
4. **Demo figures for iGEM wiki**:
    - Plot: ethylene vs time for baseline vs endophytic vs feedback modes.
    - Table: peak/steady‑state reductions per mode.

***

This PRD lets you keep your current, honest 18 % result as the **baseline**, while adding clearly separated, biologically grounded extensions that can show >50 % reductions in specific engineered or hypothesized interaction scenarios.

<div align="center">⁂</div>

[^1]: README.md

[^2]: This-is-the-only-pathway-we-are-considering-based.docx

[^3]: acc_model_parameters.csv

[^4]: acc_ethylene_simulation_results.csv

[^5]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5258695/

[^6]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5827301/

[^7]: https://www.mdpi.com/2079-7737/12/8/1043

[^8]: https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2014.00640/full

[^9]: http://link.springer.com/10.1007/s13205-020-2104-y

[^10]: http://link.springer.com/10.1007/s00344-011-9236-6

[^11]: https://bmcplantbiol.biomedcentral.com/articles/10.1186/s12870-018-1618-5

[^12]: https://www.tandfonline.com/doi/full/10.1080/15592324.2022.2152224

[^13]: https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/nph.16873

[^14]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7820975/

[^15]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4577410/

[^16]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10452086/

[^17]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5935104/

