/*******************************************************
  FOREST FIRE EARLY WARNING SYSTEM – FINAL PROJECT CODE
********************************************************/

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// --------------------------- SENSOR PINS ---------------------------
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define MQ2_DO_PIN 18
#define MQ2_AO_PIN 34   // ESP32 analog pin
#define MQ135_AO_PIN 35 // ESP32 analog pin
#define BUZZER_PIN 19

// --------------------------- WIFI DETAILS ---------------------------
const char* ssid = "Monika";
const char* password = "12345678";

// --------------------------- THINGSPEAK SETTINGS ---------------------------
String apiKey = "6KUBFHT17HTKJH3L";
String server = "http://api.thingspeak.com/update";

// ---------------------- BASELINES (modify from your test) --------------------
float BASE_TEMP = 26.7;
float BASE_MQ2 = 2775;
float BASE_MQ135 = 2075;

// ---------------------- ADAPTIVE THRESHOLDS -------------------------------
float TEMP_THRESHOLD = BASE_TEMP + 18;
int MQ2_THRESHOLD = BASE_MQ2 * 1.35;
int MQ135_THRESHOLD = BASE_MQ135 * 1.30;

// --------------------------- FUNCTIONS ------------------------------------
float safeReadTemp() {
  float t = dht.readTemperature();
  if (isnan(t)) return BASE_TEMP;
  return t;
}

float safeReadHumidity() {
  float h = dht.readHumidity();
  if (isnan(h)) return 50.0;
  return h;
}

int readAnalogAvg(int pin) {
  long sum = 0;
  for (int i = 0; i < 8; i++) {
    sum += analogRead(pin);
    delay(10);
  }
  return sum / 8;
}

float computeFireRisk(float temp, int mq2, int mq135) {
  float T_norm = fminf(1.0f, temp / TEMP_THRESHOLD);
  float MQ2_norm = fminf(1.0f, (float)mq2 / MQ2_THRESHOLD);
  float MQ135_norm = fminf(1.0f, (float)mq135 / MQ135_THRESHOLD);

  float risk = (0.40f * T_norm) +
               (0.35f * MQ2_norm) +
               (0.25f * MQ135_norm);

  return risk * 100.0f;
}

String classifyRisk(float risk) {
  if (risk < 25) return "SAFE";
  if (risk < 50) return "MODERATE";
  if (risk < 75) return "HIGH RISK";
  return "🔥 FIRE ALERT";
}

void sendToThingSpeak(float temp, float hum, int mq2, int mq135, float risk) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String request = server +
                   "?api_key=" + apiKey +
                   "&field1=" + String(temp) +
                   "&field2=" + String(hum) +
                   "&field3=" + String(mq2) +
                   "&field4=" + String(mq135) +
                   "&field5=" + String(risk);

  http.begin(request);
  http.GET();
  http.end();
}

// ---------------------------- SETUP ---------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  dht.begin();
  pinMode(MQ2_DO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Improve ESP32 ADC accuracy
  analogReadResolution(12);
  analogSetPinAttenuation(MQ2_AO_PIN, ADC_11db);
  analogSetPinAttenuation(MQ135_AO_PIN, ADC_11db);

  // WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    Serial.print(".");
    delay(500);
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? "\nWiFi Connected!" : "\nWiFi Failed.");
}

// ----------------------------- LOOP ---------------------------------------
void loop() {

  float temp = safeReadTemp();
  float hum = safeReadHumidity();
  int mq2 = readAnalogAvg(MQ2_AO_PIN);
  int mq135 = readAnalogAvg(MQ135_AO_PIN);
  int mq2_digital = digitalRead(MQ2_DO_PIN);

  float risk = computeFireRisk(temp, mq2, mq135);
  String status = classifyRisk(risk);

  Serial.println("=================================================");
  Serial.printf("Temperature    : %.2f°C\n", temp);
  Serial.printf("Humidity       : %.2f%%\n", hum);
  Serial.printf("MQ2 Analog     : %d\n", mq2);
  Serial.printf("MQ135 Analog   : %d\n", mq135);
  Serial.printf("Fire Risk      : %.2f%%  --> %s\n", risk, status.c_str());
  Serial.println("=================================================\n");

  // ------------------ FIX: Prevent buzzer false noise ------------------
  if (risk > 75 || mq2_digital == 0) {
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }

  sendToThingSpeak(temp, hum, mq2, mq135, risk);

  delay(5000);
}
