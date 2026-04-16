import os
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
import traceback

# Import necessary classes and functions from your original training script
# For simplicity, we redefine the required data structures and logic here,
# or you could import them if your original script is named e.g., `train.py`.

from dataclasses import dataclass

@dataclass
class MachineConfig:
    name: str = "CNC-Machine"
    n_balls: int = 8
    ball_diameter_mm: float = 12.0
    pitch_diameter_mm: float = 52.0
    contact_angle_deg: float = 0.0
    rated_rpm: float = 1500.0
    sampling_rate_hz: int = 10000
    temp_normal_max_c: float = 70.0
    temp_warning_c: float = 85.0
    temp_critical_c: float = 95.0
    vib_good_mm_s: float = 2.3
    vib_satisfactory_mm_s: float = 4.5
    vib_unsatisfactory_mm_s: float = 7.1
    machine_replacement_cost_usd: float = 50000
    hourly_production_value_usd: float = 200
    bearing_replacement_cost_usd: float = 300
    spindle_repair_cost_usd: float = 4000
    emergency_multiplier: float = 2.5
    planned_labor_hours: float = 4
    unplanned_labor_hours: float = 12
    labor_rate_usd_hr: float = 80
    avg_unplanned_downtime_hours: float = 48

# Helper functions for the API (re-implemented from your original code)
MAX_RUL = 120

def predict_rul(model, scaler, X: pd.DataFrame) -> np.ndarray:
    return np.clip(model.predict(scaler.transform(X.fillna(0))), 0, MAX_RUL)

def anomaly_score(model, X: pd.DataFrame) -> np.ndarray:
    scaler = model.named_steps["scaler"]
    iso = model.named_steps["iso_forest"]
    raw = iso.score_samples(scaler.transform(X.fillna(0)))
    lo, hi = raw.min(), raw.max()
    return 1 - (raw - lo) / (hi - lo + 1e-9)

def health_score(anom: np.ndarray, rul: np.ndarray, severity_mm_s: Optional[np.ndarray] = None, temp_c: Optional[np.ndarray] = None, cfg: MachineConfig = None) -> np.ndarray:
    cfg = cfg or MachineConfig()
    rul_norm = np.clip(rul / MAX_RUL, 0, 1)
    anom_pen = np.clip(anom, 0, 1)

    iso_pen = np.zeros(len(rul_norm))
    if severity_mm_s is not None:
        iso_pen = np.where(severity_mm_s > cfg.vib_unsatisfactory_mm_s, 0.4,
                 np.where(severity_mm_s > cfg.vib_satisfactory_mm_s,   0.2,
                 np.where(severity_mm_s > cfg.vib_good_mm_s,           0.1, 0.0)))

    thermal_pen = np.zeros(len(rul_norm))
    if temp_c is not None:
        thermal_pen = np.where(temp_c > cfg.temp_critical_c, 0.4,
                      np.where(temp_c > cfg.temp_warning_c,   0.2,
                      np.where(temp_c > cfg.temp_normal_max_c, 0.1, 0.0)))

    score = (
        0.60 * rul_norm * 100
        + 0.25 * (1 - anom_pen) * 100
        + 0.10 * (1 - iso_pen) * 100
        + 0.05 * (1 - thermal_pen) * 100
    )
    return np.clip(score, 0, 100).round(1)

def alert_level(score: float) -> str:
    if score >= 75: return "✅ NORMAL"
    if score >= 50: return "⚠️ WATCH"
    if score >= 25: return "🔶 WARNING"
    return "🔴 CRITICAL"

@dataclass
class CostReport:
    # ... Simplified definition
    repair_now_cost: float = 0.0
    repair_later_cost: float = 0.0
    potential_savings: float = 0.0
    roi_pct: float = 0.0
    recommendation: str = ""

def cost_benefit_analysis(machine_id: str, health_score: float, rul_days: float, dominant_fault: str, cfg: MachineConfig):
    # Simplified cost benefit logic adapted from your code
    c = CostReport()
    parts_now = cfg.bearing_replacement_cost_usd
    c.repair_now_cost = parts_now + cfg.planned_labor_hours * cfg.labor_rate_usd_hr + cfg.planned_labor_hours * cfg.hourly_production_value_usd
    
    secondary_damage_prob = max(0, (100 - health_score) / 100) ** 1.5
    secondary_cost = cfg.spindle_repair_cost_usd * secondary_damage_prob
    emergency_parts = parts_now * cfg.emergency_multiplier + secondary_cost
    emergency_labour = cfg.unplanned_labor_hours * cfg.labor_rate_usd_hr * cfg.emergency_multiplier
    production_loss = cfg.avg_unplanned_downtime_hours * cfg.hourly_production_value_usd
    catastrophic_prob = max(0, (1 - health_score / 100) ** 2)
    catastrophic_cost = cfg.machine_replacement_cost_usd * catastrophic_prob * 0.15
    
    c.repair_later_cost = emergency_parts + emergency_labour + production_loss + catastrophic_cost
    c.potential_savings = c.repair_later_cost - c.repair_now_cost
    c.roi_pct = (c.potential_savings / c.repair_now_cost) * 100 if c.repair_now_cost > 0 else 0.0
    
    urgency = "immediately" if health_score < 25 else "within 1 week" if health_score < 50 else "within 1 month" if health_score < 75 else "at next scheduled service"
    c.recommendation = f"Schedule {dominant_fault} repair {urgency}. Estimated RUL: {rul_days:.0f} days. Acting now saves ${c.potential_savings:,.0f} (ROI: {c.roi_pct:.0f}%)."
    return c

# --- FastAPI App Setup ---

app = FastAPI(title="Predictive Maintenance API", version="1.0")

# Load models from disk
MODEL_DIR = "models"
if not os.path.exists(MODEL_DIR):
    MODEL_DIR = "model" # Fallback if folder is named model

try:
    anomaly_model = joblib.load(os.path.join(MODEL_DIR, "anomaly.pkl"))
    rul_model     = joblib.load(os.path.join(MODEL_DIR, "rul_model.pkl"))
    rul_scaler    = joblib.load(os.path.join(MODEL_DIR, "rul_scaler.pkl"))
    fault_model   = joblib.load(os.path.join(MODEL_DIR, "fault_classifier.pkl"))
    label_enc     = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    feature_cols  = joblib.load(os.path.join(MODEL_DIR, "features.pkl"))
except Exception as e:
    print(f"Warning: Could not load models correctly from {MODEL_DIR}. Please ensure training was completed.")
    print(e)
    anomaly_model, rul_model, rul_scaler, fault_model, label_enc, feature_cols = None, None, None, None, None, []

cfg = MachineConfig()

# Pydantic Schemas for requests/responses
class SensorData(BaseModel):
    machine_id: str
    vibration_rms_g: float
    temperature_c: float
    kurtosis: float
    crest_factor: float
    rpm: Optional[float] = 1500.0
    severity_mm_s: Optional[float] = 1.0

class FeatureData(BaseModel):
    # This endpoint expects the fully engineered feature dictionary instead of just raw points
    # because feature engineering involves rolling windows.
    machine_id: str
    features: dict

@app.get("/")
def read_root():
    return {"message": "Predictive Maintenance API is running."}

@app.post("/predict_features")
def predict_from_features(data: FeatureData):
    """
    Predict machine health using pre-engineered features.
    Pass a JSON dict with all required `feature_cols`.
    """
    try:
        if None in [anomaly_model, rul_model, rul_scaler, fault_model, label_enc]:
            raise HTTPException(status_code=500, detail="Models not loaded. Ensure the `model` folder exists with all .pkl files.")

        df = pd.DataFrame([data.features])
        
        # Ensure all feature_cols exist
        for col in feature_cols:
            if col not in df.columns:
                df[col] = 0.0

        X_df = df[feature_cols]

        # 1. Anomaly
        anom  = anomaly_score(anomaly_model, X_df)[0]
        # 2. RUL
        rul   = predict_rul(rul_model, rul_scaler, X_df)[0]
        # 3. Fault
        fault_proba = fault_model.predict_proba(X_df)[0]
        fault_class = label_enc.classes_[np.argmax(fault_proba)]
        fault_conf  = float(np.max(fault_proba))

        # Severity
        severity = df["severity_mm_s"].iloc[0] if "severity_mm_s" in df.columns else 2.0
        temp_c = df["temperature_c"].iloc[0] if "temperature_c" in df.columns else 50.0

        # Health
        hs = health_score(
            np.array([anom]),
            np.array([rul]),
            severity_mm_s=np.array([severity]),
            temp_c=np.array([temp_c]),
            cfg=cfg,
        )[0]

        # Cost Benefit
        cost = cost_benefit_analysis(data.machine_id, hs, rul, fault_class, cfg)

        iso_zone = "A" if severity < cfg.vib_good_mm_s else \
                   "B" if severity < cfg.vib_satisfactory_mm_s else \
                   "C" if severity < cfg.vib_unsatisfactory_mm_s else "D"
                   
        stage = df["stage_estimate"].iloc[0] if "stage_estimate" in df.columns else 2 # Defaulting or should be passed
        rpm = df["rpm"].iloc[0] if "rpm" in df.columns else 1500.0

        bar_len = int(hs / 5)
        bar = ("█" * bar_len).ljust(20)
        
        report_text = f'''┌─ {data.machine_id} ───────────────────────────────────────
  │  Health : [{bar}]  {hs:4.1f}/100  {alert_level(hs)}
  │  Fault  : {fault_class} (conf: {fault_conf*100:.1f}%)
  │  RUL    : {rul:.1f} days remaining
  │  Stage  : {stage} / 3  (0=healthy, 3=critical)
  │  ISO    : Zone {iso_zone}  ({severity:.3f} mm/s RMS)
  │  Temp   : {temp_c:.2f} °C
  │  RPM    : {rpm:.1f}
  ├─ COST ANALYSIS ─────────────────────────────────────────
  │  Repair now    : $ {cost.repair_now_cost:>7,.0f}
  │  Run-to-fail   : $ {cost.repair_later_cost:>7,.0f}  (est. breakdown cost)
  │  You save       : $ {cost.potential_savings:>7,.0f}  (ROI: {cost.roi_pct:.1f}%)
  ├─ RECOMMENDATION ────────────────────────────────────────
  │  {cost.recommendation}'''

        return {
            "machine_id": data.machine_id,
            "health_score": hs,
            "alert": alert_level(hs),
            "dominant_fault": str(fault_class),
            "fault_confidence": round(fault_conf * 100, 2),
            "rul_days": round(rul, 1),
            "stage": stage,
            "iso_zone": iso_zone,
            "severity_mm_s": round(severity, 3),
            "temperature_c": round(temp_c, 2),
            "rpm": round(rpm, 1),
            "repair_now_cost": round(cost.repair_now_cost, 0),
            "run_to_fail_cost": round(cost.repair_later_cost, 0),
            "savings_if_repaired": round(cost.potential_savings, 0),
            "roi_pct": round(cost.roi_pct, 1),
            "recommendation": cost.recommendation,
            "formatted_report": report_text
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
