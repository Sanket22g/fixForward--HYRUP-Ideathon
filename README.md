# 🛡️ MSME-Guard — Hybrid Predictive Maintenance System

> **Hackathon Prototype** · FixForward HYRUP Ideathon 2026

MSME-Guard is a **mobile-first AIoT platform** for Indian MSMEs that predicts machine failures before they happen — combining real ML models, a FastAPI backend, and a CrewAI multi-agent advisory layer.

---

## 🧠 How It Works — Hybrid Architecture

```
IoT Sensors (ESP32)
       │
       ▼
 FastAPI Backend  ──→  ML Models (scikit-learn)
  (Api_cnc/)              ├─ Isolation Forest  (anomaly detection)
       │                  ├─ Random Forest RUL (remaining useful life)
       │                  └─ Fault Classifier  (bearing / imbalance / etc.)
       │
       ▼
 CrewAI Agent Pipeline
  (crewai_agent/)
       ├─ Fault Analyst Agent   → interprets ML output
       ├─ Cost Advisor Agent    → repair vs failure cost (INR)
       └─ Action Agent          → plain-English report for owner
       │
       ▼
 React Dashboard (Mobile UI)
  (src/)  →  Shows alert, cost card, action buttons
```

---

## 📁 Project Structure

```
msme-guard/
│
├── Api_cnc/                   # 🔧 FastAPI ML Backend
│   ├── api.py                 # REST endpoints + ML inference logic
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Container deployment
│   └── model/                 # Trained ML model files (.pkl)
│       ├── anomaly.pkl        # Isolation Forest — anomaly detection
│       ├── rul_model.pkl      # Random Forest — Remaining Useful Life
│       ├── rul_scaler.pkl     # Feature scaler for RUL model
│       ├── fault_classifier.pkl  # Fault type classifier
│       ├── label_encoder.pkl  # Fault label encoder
│       └── features.pkl       # Feature column list
│
├── crewai_agent/              # 🤖 CrewAI Multi-Agent Pipeline
│   ├── main.py                # 3-agent advisory system
│   ├── requirements.txt
│   └── README.md
│
└── src/                       # 📱 React Frontend (Mobile Dashboard)
    ├── pages/
    │   ├── LandingPage.tsx
    │   └── Dashboard.tsx
    ├── components/
    │   ├── CallModal.tsx
    │   └── ActivityLog.tsx
    └── App.tsx
```

---

## 🔧 ML Backend — `Api_cnc/`

Built with **FastAPI** + **scikit-learn**. Loads pre-trained `.pkl` models and serves predictions via REST API.

### ML Models Used

| Model | Algorithm | Purpose |
|---|---|---|
| `anomaly.pkl` | Isolation Forest | Detect abnormal sensor patterns |
| `rul_model.pkl` | Random Forest Regressor | Predict days remaining before failure |
| `fault_classifier.pkl` | Random Forest Classifier | Classify fault type (bearing, imbalance, etc.) |

### Health Score Formula

```
Health Score = 0.60 × RUL_norm
             + 0.25 × (1 − anomaly_score)
             + 0.10 × (1 − vibration_penalty)
             + 0.05 × (1 − thermal_penalty)
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/predict_features` | Run full ML inference → returns health score, fault type, RUL, cost analysis |

### Sample Request

```json
POST /predict_features
{
  "machine_id": "CNC-03",
  "features": {
    "vibration_rms_g": 4.82,
    "temperature_c": 73.4,
    "kurtosis": 6.1,
    "crest_factor": 4.3,
    "severity_mm_s": 4.82,
    "rpm": 1500
  }
}
```

### Sample Response

```json
{
  "machine_id": "CNC-03",
  "health_score": 38.2,
  "alert": "🔶 WARNING",
  "dominant_fault": "bearing_wear",
  "fault_confidence": 87.4,
  "rul_days": 2.1,
  "repair_now_cost": 1200,
  "run_to_fail_cost": 47000,
  "savings_if_repaired": 45800,
  "recommendation": "Schedule bearing repair immediately. Estimated RUL: 2 days."
}
```

### Run Locally

```bash
cd Api_cnc
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

Or with Docker:

```bash
docker build -t msme-guard-api .
docker run -p 8000:8000 msme-guard-api
```

---

## 🤖 AI Agent Layer — `crewai_agent/`

Built with **CrewAI**. Three agents run sequentially after the ML backend produces a fault reading:

| Agent | Role |
|---|---|
| 🔍 Fault Analyst | Interprets sensor data and ML output — identifies fault type & severity |
| 💰 Cost Advisor | Estimates repair cost vs full failure cost in INR with ROI |
| 📋 Action Coordinator | Writes a plain-English 150-word report the factory owner can act on in 30 seconds |

```bash
cd crewai_agent
pip install -r requirements.txt
set OPENAI_API_KEY=sk-your-key-here
python main.py
```

---

## 📱 Frontend — React Dashboard

Mobile-first dark-theme UI built with **React + Vite + Tailwind CSS**.

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

### Deploy

```bash
# Vercel
npx vercel --prod

# Netlify — build then drag dist/ folder
npm run build
```

---

## 🛠️ Full Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (dark theme, mobile-first) |
| ML Models | scikit-learn (Isolation Forest, Random Forest) |
| API | FastAPI + Uvicorn |
| AI Agents | CrewAI (GPT-4 powered) |
| IoT | ESP32 + ADXL345 + DS18B20 (hardware layer) |
| Containerisation | Docker |

---

## ⚠️ Hardware Note

The **"Connect Live Device"** button in the UI requires physical MSME-Guard IoT hardware (ESP32 + sensors) on the same local network. Without hardware, click **"View Demo"** — the app runs fully in the browser using realistic mock data from Nashik MIDC.
