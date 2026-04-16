> [!CAUTION]
> **🔌 Hardware Required for Live Mode**
> The **"Connect Live Device"** feature requires physical MSME-Guard IoT hardware (ESP32 + sensors) to be connected on the same local network.
> **Without hardware, use "View Demo"** — the app runs fully in the browser with realistic mock data. No setup needed.

---

# 🛡️ MSME-Guard — Predictive Maintenance for Indian MSMEs

> **Hackathon Prototype** · FixForward HYRUP Ideathon 2026

MSME-Guard is a mobile-first AIoT dashboard that helps small manufacturers prevent costly machine breakdowns using real-time sensor data and predictive analytics.

---

## 🚀 Live Demo

Deployed on Vercel / Netlify — no backend required. Everything runs in the browser using mock data.

---

## ⚠️ Important: Live Device Mode

> **The "Connect Live Device" button requires physical MSME-Guard hardware to function.**

The live device connection is designed to pair with our custom IoT retrofit kit:

| Component | Detail |
|---|---|
| Vibration Sensor | ADXL345 (3-axis accelerometer) |
| Temperature Sensor | DS18B20 |
| Microcontroller | ESP32 (Wi-Fi enabled) |
| Protocol | MQTT over local Wi-Fi |
| Edge AI | TFLite bearing fault model |

**Without hardware**, the app runs in full **Demo Mode** using realistic data sampled from Nashik MIDC MSME machinery.

---

## 🎯 Project Overview

MSME-Guard retrofits **legacy industrial machines** with a low-cost AIoT sensor kit that:

1. **Monitors** vibration, temperature, and acoustic signals in real-time
2. **Predicts** failures 24–72 hours before they occur using edge ML models
3. **Alerts** owners instantly via the mobile dashboard
4. **Quantifies** savings — e.g., ₹1,200 repair vs ₹47,000 breakdown cost

### Why it matters
- 63 million MSMEs in India operate legacy machines with **zero predictive maintenance**
- Unplanned downtime costs **₹2–8 lakh per incident** on average
- Our solution costs **under ₹3,000** per machine to deploy

---

## 📱 App Screens

| Screen | Description |
|---|---|
| **Landing** | Entry point with demo / device connect options |
| **Dashboard** | Live machine health, cost comparison, action buttons |

---

## 🛠️ Tech Stack

- **React 18** + **Vite** (TypeScript)
- **Tailwind CSS** — dark theme, mobile-first
- **Lucide React** — icons
- **Sonner** — toast notifications
- **No backend** — all mock data in component state

---

## 🤖 AI Agent (CrewAI)

The `crewai_agent/` folder contains a **multi-agent AI pipeline** powered by [CrewAI](https://github.com/joaomdmoura/crewAI):

| Agent | What it does |
|---|---|
| 🔍 Fault Analyst | Reads sensor data → identifies fault type & severity |
| 💰 Cost Advisor | Calculates repair vs failure cost in INR |
| 📋 Action Coordinator | Writes a plain-English report for the owner |

> See [`crewai_agent/README.md`](./crewai_agent/README.md) for setup & usage.

---

## ⚙️ Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment

### Vercel
```bash
npx vercel --prod
```

### Netlify
```bash
npm run build
# Drag & drop the `dist/` folder to Netlify
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx    # Screen 1 — Hero & CTAs
│   └── Dashboard.tsx      # Screen 2 — Machine alert & actions
├── components/
│   ├── CallModal.tsx      # Simulated call overlay
│   └── ActivityLog.tsx    # Timeline log
├── App.tsx                # Screen navigation state
└── index.css              # Global styles & animations
```

---

## 👥 Team

**Team HYRUP** · FixForward Ideathon 2026  
Built with ❤️ for Indian MSMEs

---

*"A machine is about to fail. We tell you before it does."*
