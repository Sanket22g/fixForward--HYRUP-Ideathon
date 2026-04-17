/*
  MSME-Guard — ESP32 Demo Firmware
  ==================================
  Simulates vibration + temperature sensor readings
  and sends them to the FastAPI backend every 5 seconds.

  Hardware (real setup):
    - ESP32 DevKit
    - ADXL345  → vibration (I2C: SDA=21, SCL=22)
    - DS18B20  → temperature (GPIO 4)

  Demo mode:
    - No real sensors needed
    - Generates realistic mock readings
    - Sends to FastAPI /predict_features endpoint

  Install libraries (Arduino IDE):
    - ArduinoJson  (search in Library Manager)
    - HTTPClient   (built-in with ESP32 board package)
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ── WiFi Config ──────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ── Backend URL ──────────────────────────────────────────
// Change to your FastAPI server IP when running locally
const char* API_URL = "http://192.168.1.100:8000/predict_features";

// ── Machine Config ───────────────────────────────────────
const char* MACHINE_ID = "CNC-03";
const float RATED_RPM  = 1500.0;

// ── Timing ───────────────────────────────────────────────
const unsigned long SEND_INTERVAL_MS = 5000;  // Send every 5 seconds
unsigned long lastSendTime = 0;

// ── Demo: simulate gradual bearing wear over time ─────────
int   readingCount    = 0;
float baseVibration   = 1.8;   // starts healthy
float baseTemperature = 55.0;

// ─────────────────────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("\n========================================");
  Serial.println("   MSME-Guard ESP32 — Demo Firmware");
  Serial.println("========================================\n");

  connectWiFi();
}

void loop() {
  unsigned long now = millis();

  if (now - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = now;
    readingCount++;

    // Simulate gradual degradation (bearing wear)
    float vibration   = simulateVibration();
    float temperature = simulateTemperature();
    float kurtosis    = simulateKurtosis(vibration);
    float crestFactor = simulateCrestFactor(vibration);

    Serial.println("──────────────────────────────────");
    Serial.printf("Reading #%d\n", readingCount);
    Serial.printf("  Vibration  : %.2f mm/s\n", vibration);
    Serial.printf("  Temperature: %.1f °C\n",   temperature);
    Serial.printf("  Kurtosis   : %.2f\n",       kurtosis);
    Serial.printf("  Crest Factor: %.2f\n",      crestFactor);
    Serial.printf("  RPM        : %.0f\n",        RATED_RPM);

    sendToAPI(vibration, temperature, kurtosis, crestFactor);
  }
}

// ── WiFi ─────────────────────────────────────────────────

void connectWiFi() {
  Serial.printf("Connecting to WiFi: %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected");
    Serial.printf("   IP Address: %s\n\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n⚠️  WiFi failed — running in offline demo mode\n");
  }
}

// ── Send Data to FastAPI ──────────────────────────────────

void sendToAPI(float vibration, float temperature, float kurtosis, float crestFactor) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("  [OFFLINE] Skipping HTTP send.");
    return;
  }

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  // Build JSON payload
  StaticJsonDocument<512> doc;
  doc["machine_id"] = MACHINE_ID;

  JsonObject features = doc.createNestedObject("features");
  features["vibration_rms_g"] = vibration;
  features["temperature_c"]   = temperature;
  features["kurtosis"]         = kurtosis;
  features["crest_factor"]     = crestFactor;
  features["severity_mm_s"]    = vibration;
  features["rpm"]              = RATED_RPM;
  features["stage_estimate"]   = estimateStage(vibration);

  String payload;
  serializeJson(doc, payload);

  Serial.printf("  → POST %s\n", API_URL);

  int httpCode = http.POST(payload);

  if (httpCode == 200) {
    String response = http.getString();

    // Parse response
    StaticJsonDocument<1024> res;
    deserializeJson(res, response);

    float  health    = res["health_score"];
    float  rul       = res["rul_days"];
    String alert     = res["alert"];
    String fault     = res["dominant_fault"];
    float  savings   = res["savings_if_repaired"];

    Serial.println("  ← API Response:");
    Serial.printf("     Health Score : %.1f / 100\n", health);
    Serial.printf("     Alert        : %s\n",         alert.c_str());
    Serial.printf("     Fault        : %s\n",         fault.c_str());
    Serial.printf("     RUL          : %.1f days\n",  rul);
    Serial.printf("     Savings      : $%.0f\n",      savings);

    // Blink LED on critical alert
    if (health < 25) {
      Serial.println("  🔴 CRITICAL — triggering alert LED");
      blinkAlert(5);
    } else if (health < 50) {
      Serial.println("  🔶 WARNING");
      blinkAlert(2);
    }
  } else {
    Serial.printf("  ✗ HTTP Error: %d\n", httpCode);
  }

  http.end();
  Serial.println();
}

// ── Sensor Simulation ─────────────────────────────────────

float simulateVibration() {
  // Gradually increase vibration to simulate bearing wear
  float wear = min((float)readingCount * 0.05f, 3.5f);
  float noise = ((float)random(-20, 20)) / 100.0f;
  return baseVibration + wear + noise;
}

float simulateTemperature() {
  float drift = min((float)readingCount * 0.08f, 20.0f);
  float noise = ((float)random(-10, 10)) / 10.0f;
  return baseTemperature + drift + noise;
}

float simulateKurtosis(float vibration) {
  // Higher kurtosis indicates impulsive bearing faults
  return 3.0f + (vibration - baseVibration) * 0.8f + ((float)random(-10, 10)) / 20.0f;
}

float simulateCrestFactor(float vibration) {
  return 2.5f + (vibration - baseVibration) * 0.3f + ((float)random(-5, 5)) / 20.0f;
}

int estimateStage(float vibration) {
  if (vibration < 2.3f) return 0;   // Healthy
  if (vibration < 4.5f) return 1;   // Early wear
  if (vibration < 7.1f) return 2;   // Moderate
  return 3;                          // Critical
}

// ── LED Alert (GPIO 2 = built-in LED on most ESP32) ───────

void blinkAlert(int times) {
  pinMode(2, OUTPUT);
  for (int i = 0; i < times; i++) {
    digitalWrite(2, HIGH);
    delay(150);
    digitalWrite(2, LOW);
    delay(150);
  }
}
