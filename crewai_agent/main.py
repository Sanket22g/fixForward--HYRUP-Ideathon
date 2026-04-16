"""
MSME-Guard — CrewAI Agent Pipeline
====================================
Multi-agent AI system that:
  1. Fault Analyst Agent   → analyses raw sensor readings
  2. Cost Advisor Agent    → estimates repair vs failure cost
  3. Action Agent          → generates a plain-language action report

Run:
    pip install -r requirements.txt
    python main.py
"""

from crewai import Agent, Task, Crew, Process

# ── Mock sensor data (replace with live MQTT payload in production) ──────────
SENSOR_DATA = {
    "machine_id": "CNC-03",
    "location": "Nashik MIDC, Bay-7",
    "vibration_rms": 4.82,      # mm/s  (threshold: 2.8)
    "temperature_c": 73.4,       # °C    (threshold: 65)
    "acoustic_db": 91.2,         # dB    (threshold: 85)
    "runtime_hours": 6240,
    "last_service_hours": 5800,
}

# ── Agents ───────────────────────────────────────────────────────────────────

fault_analyst = Agent(
    role="Industrial Fault Analyst",
    goal=(
        "Analyse sensor readings from MSME machinery and identify "
        "the root cause and severity of any detected fault."
    ),
    backstory=(
        "You are a seasoned industrial engineer with 15 years of experience "
        "diagnosing CNC and lathe machine failures in Indian MSME factories. "
        "You specialise in vibration analysis and predictive maintenance."
    ),
    verbose=True,
    allow_delegation=False,
)

cost_advisor = Agent(
    role="Maintenance Cost Advisor",
    goal=(
        "Based on the identified fault, estimate the cost of early repair "
        "versus the cost of a full machine failure, and quantify the savings."
    ),
    backstory=(
        "You are a financial analyst for manufacturing SMEs. "
        "You have deep knowledge of spare-part costs, labour rates, and "
        "production downtime losses for small Indian factories."
    ),
    verbose=True,
    allow_delegation=False,
)

action_agent = Agent(
    role="Maintenance Action Coordinator",
    goal=(
        "Generate a clear, actionable maintenance report for the factory "
        "owner — written in simple English, no jargon."
    ),
    backstory=(
        "You communicate complex technical findings in simple language "
        "so that non-technical MSME owners can make fast, confident decisions."
    ),
    verbose=True,
    allow_delegation=False,
)

# ── Tasks ────────────────────────────────────────────────────────────────────

task_analyse = Task(
    description=(
        f"Analyse the following sensor data from machine {SENSOR_DATA['machine_id']} "
        f"at {SENSOR_DATA['location']}:\n\n"
        f"  • Vibration RMS : {SENSOR_DATA['vibration_rms']} mm/s\n"
        f"  • Temperature   : {SENSOR_DATA['temperature_c']} °C\n"
        f"  • Acoustic level: {SENSOR_DATA['acoustic_db']} dB\n"
        f"  • Total runtime : {SENSOR_DATA['runtime_hours']} hrs\n"
        f"  • Since service : {SENSOR_DATA['runtime_hours'] - SENSOR_DATA['last_service_hours']} hrs\n\n"
        "Identify: fault type, affected component, severity (Low/Medium/High/Critical), "
        "and estimated time to failure."
    ),
    expected_output=(
        "A structured fault report with: fault type, component, severity level, "
        "confidence percentage, and estimated hours to failure."
    ),
    agent=fault_analyst,
)

task_cost = Task(
    description=(
        "Using the fault report provided, calculate:\n"
        "1. Cost of fixing the fault NOW (early repair)\n"
        "2. Cost if the machine FAILS completely (parts + labour + downtime)\n"
        "3. Total savings from acting early\n\n"
        "Use realistic Indian market prices (INR). "
        "Downtime loss = ₹8,000 per hour of lost production."
    ),
    expected_output=(
        "A cost breakdown in INR with: early repair cost, failure cost, "
        "savings amount, and ROI of acting now."
    ),
    agent=cost_advisor,
)

task_report = Task(
    description=(
        "Using the fault analysis and cost breakdown, write a short action report "
        "for the factory owner. Include:\n"
        "  • What is wrong (1 sentence, plain English)\n"
        "  • What happens if ignored (1 sentence)\n"
        "  • Recommended action with urgency level\n"
        "  • Money saved by acting now\n\n"
        "Keep it under 150 words. No technical jargon."
    ),
    expected_output=(
        "A plain-English action report under 150 words that a factory owner "
        "can read in 30 seconds and immediately act on."
    ),
    agent=action_agent,
)

# ── Crew ─────────────────────────────────────────────────────────────────────

crew = Crew(
    agents=[fault_analyst, cost_advisor, action_agent],
    tasks=[task_analyse, task_cost, task_report],
    process=Process.sequential,
    verbose=True,
)

# ── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  MSME-Guard · CrewAI Predictive Maintenance Pipeline")
    print("=" * 60 + "\n")

    result = crew.kickoff()

    print("\n" + "=" * 60)
    print("  FINAL ACTION REPORT")
    print("=" * 60)
    print(result)
    print("=" * 60 + "\n")
