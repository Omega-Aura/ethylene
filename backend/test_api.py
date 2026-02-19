from fastapi.testclient import TestClient
from main import app, run_simulation, DEFAULT_PARAMS, DEFAULT_ICS, DEFAULT_SIM
import pytest

client = TestClient(app)

def test_api_defaults():
    """Verify that defaults API returns correct params."""
    response = client.get("/api/defaults")
    assert response.status_code == 200
    defaults = response.json()
    
    assert "params" in defaults
    assert "initial_conditions" in defaults
    assert "simulation_settings" in defaults
    
    # Check key parameter existence
    for p in ["V_max_ACCD", "K_E", "r_g", "f_stress"]:
        assert p in defaults['params']

def test_api_simulate():
    """Verify that simulate API accepts params and returns data."""
    # Run with default params
    payload = {
        "f_stress": 3.0,
        "V_max_ACCD": 1.0,
        "n_points": 500
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    result = response.json()
    
    assert "kpis" in result
    assert "timeSeries" in result
    assert len(result['timeSeries']['time']) <= 501 # Allow n_points + 1

def test_api_simulate_bad_param():
    """Verify that non-existent params are ignored and defaults used."""
    payload = {"bad_param": 999}
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    # Should run successfully as if default
    assert "kpis" in response.json()

def test_api_simulate_fail():
    """Verify that simulation fails gracefully on solver error (if possible)."""
    # This might require hacking the simulate function or passing invalid numerical values like infinity
    payload = {"V_max_ACCD": float('inf')} # Should fail
    response = client.post("/api/simulate", json=payload)
    # The default behavior should be 500 Internal Server Error
    assert response.status_code == 500
