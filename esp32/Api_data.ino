/*
  MSME-Guard — ESP32 Firmware
  ============================
  Fetches machine health prediction from cloud API (GET)
  and acts on it — LED alert + Serial monitor display.

  Flow:
    Cloud API  →  ESP32  →  LED / Serial output

  Libraries needed (Arduino IDE Library Manager):
    - ArduinoJson
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ── WiFi ──────────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ── Cloud API endpoint ────────────────────────────────────
// Replace with your deployed FastAPI URL
const char* API_URL = "http://your-api-server.com/latest_alert?machine_id=CNC-03";

// ── LED pin (built-in LED on most ESP32 boards) ───────────
const int LED_PIN = 2;

// ── Poll every 5 seconds ──────────────────────────────────
const unsigned long POLL_INTERVAL = 5000;
unsigned long lastPoll = 0;

// ─────────────────────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.println("\n========================================");
  Serial.println("   MSME-Guard ESP32 Firmware");
  Serial.println("========================================\n");

  // Connect WiFi
  Serial.printf("Connecting to WiFi: %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Connected — IP: " + WiFi.localIP().toString() + "\n");
}

void loop() {
  if (millis() - lastPoll >= POLL_INTERVAL) {
    lastPoll = millis();
    fetchAndDisplay();
  }
}

// ── Fetch latest alert from cloud ────────────────────────

void fetchAndDisplay() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Disconnected. Retrying...");
    WiFi.reconnect();
    return;
  }

  HTTPClient http;
  http.begin(API_URL);

  Serial.println("→ Fetching from cloud...");
  int httpCode = http.GET();

  if (httpCode == 200) {
    String body = http.getString();

    // Parse JSON response from API
    StaticJsonDocument<512> doc;
    DeserializationError err = deserializeJson(doc, body);

    if (err) {
      Serial.println("✗ JSON parse error");
      http.end();
      return;
    }

    // Read fields
    const char* machineId  = doc["machine_id"]          | "---";
    float       health     = doc["health_score"]         | 100.0;
    float       rul        = doc["rul_days"]             | 999.0;
    const char* alert      = doc["alert"]               | "UNKNOWN";
    const char* fault      = doc["dominant_fault"]      | "none";
    float       repairCost = doc["repair_now_cost"]     | 0.0;
    float       failCost   = doc["run_to_fail_cost"]    | 0.0;
    float       savings    = doc["savings_if_repaired"] | 0.0;

    // Print to Serial Monitor
    Serial.println("─────────────────────────────────────");
    Serial.printf("  Machine     : %s\n",     machineId);
    Serial.printf("  Health Score: %.1f / 100\n", health);
    Serial.printf("  Alert       : %s\n",     alert);
    Serial.printf("  Fault       : %s\n",     fault);
    Serial.printf("  RUL         : %.1f days\n", rul);
    Serial.printf("  Repair Now  : Rs. %.0f\n",  repairCost);
    Serial.printf("  If Ignored  : Rs. %.0f\n",  failCost);
    Serial.printf("  You Save    : Rs. %.0f\n",  savings);
    Serial.println("─────────────────────────────────────\n");

    // Act on alert level
    if (health < 25) {
      Serial.println("  🔴 CRITICAL — blinking LED fast");
      blinkLED(6, 100);
    } else if (health < 50) {
      Serial.println("  🔶 WARNING — blinking LED slow");
      blinkLED(3, 300);
    } else {
      Serial.println("  ✅ NORMAL — machine healthy");
      digitalWrite(LED_PIN, LOW);
    }

  } else {
    Serial.printf("✗ HTTP Error: %d\n", httpCode);
  }

  http.end();
}

// ── LED blink helper ──────────────────────────────────────

void blinkLED(int times, int delayMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(delayMs);
    digitalWrite(LED_PIN, LOW);
    delay(delayMs);
  }
}
