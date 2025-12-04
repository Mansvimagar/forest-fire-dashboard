AI Based Forest Fire Prediction System

A multi-sensor IoT prototype using ESP32 for early-stage forest fire detection and risk prediction.

1. System Overview

The system collects real-time environmental data through:
DHT11 – Temperature & Humidity
MQ2 – Smoke concentration
MQ135 – Air-quality / gas levels
The ESP32 processes sensor data, computes a risk score using an AI-inspired model, triggers alerts, and pushes readings to ThingSpeak for cloud monitoring.

2. Hardware Connections

ESP32
DHT11 → GPIO 4
MQ2 (Analog) → GPIO 34
MQ135 (Analog) → GPIO 35
MQ2 (Digital) → GPIO 18
Buzzer → GPIO 19
ADC attenuation is configured for MQ sensor voltages.

3. Fire Risk Model

Adaptive thresholds are derived from baseline readings:

TEMP_THRESHOLD  = BaseTemp + 18°C
MQ2_THRESHOLD   = BaseMQ2 × 1.35
MQ135_THRESHOLD = BaseMQ135 × 1.30


Normalized inputs:
Tn   = temperature / TEMP_THRESHOLD
S2   = MQ2 / MQ2_THRESHOLD
S135 = MQ135 / MQ135_THRESHOLD
Weighted risk score (0–100):
Risk = 0.40*Tn + 0.35*S2 + 0.25*S135
Risk levels: Safe / Moderate / High / Fire Alert.

4. Cloud Integration
Readings are sent to ThingSpeak via HTTP GET requests:
Temperature, humidity, MQ2, MQ135, and computed risk.
The cloud dashboard visualizes real-time trends.

5. Prototype Testing
A small forest model was used to verify:
Normal ambient behavior
Smoke and gas exposure
Temperature rise
Corresponding changes in risk score

6. Future Work
ML model deployment on-device
Eliminate dependency on WiFi router
Mobile notification system
Geographical scaling


8. Contributors
Ketaki – Hardware wiring and sensor assembly
Monika – Connections and ESP32 firmware
Mansvi – React-based dashboard
Sayali – Machine Learning model
