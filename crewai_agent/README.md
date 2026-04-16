# 🤖 MSME-Guard — CrewAI Agent Pipeline

This folder contains the **AI agent backend** for MSME-Guard, built with [CrewAI](https://github.com/joaomdmoura/crewAI).

## What it does

Three agents work in sequence when a machine anomaly is detected:

| Agent | Role |
|---|---|
| 🔍 **Fault Analyst** | Reads sensor data → identifies fault type & severity |
| 💰 **Cost Advisor** | Calculates repair cost vs failure cost in INR |
| 📋 **Action Coordinator** | Writes a plain-English report for the factory owner |

## Setup

```bash
cd crewai_agent

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set your OpenAI API key
set OPENAI_API_KEY=sk-...    # Windows
# export OPENAI_API_KEY=sk-... # Mac/Linux

# Run the pipeline
python main.py
```

## Sample Output

```
======================================================
  MSME-Guard · CrewAI Predictive Maintenance Pipeline
======================================================

[Fault Analyst] → Bearing wear detected on CNC-03
[Cost Advisor]  → Repair: ₹1,200 | Failure: ₹47,000 | Savings: ₹45,800
[Action Agent]  → Final report generated

======================================================
  FINAL ACTION REPORT
======================================================
Your CNC-03 machine has a worn bearing that will fail within 48 hours.
If ignored, the full machine breakdown will cost ₹47,000 in parts,
labour, and lost production. Acting now costs only ₹1,200 — saving
you ₹45,800. Call a mechanic today. Urgency: HIGH.
======================================================
```

> **Note:** This uses the OpenAI API (GPT-4). Requires a valid `OPENAI_API_KEY`.
