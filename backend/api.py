from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import joblib

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("model.pkl")

THINGSPEAK_URL = "https://api.thingspeak.com/channels/3064498/feeds.json?api_key=D9MKK4XDV1WF9PEC&results=1"

@app.get("/")
def home():
    return {"status": "backend running"}

@app.get("/live")
def get_live_data():
    """Fetch live data from ThingSpeak"""
    r = requests.get(THINGSPEAK_URL).json()

    feed = r["feeds"][0]

    temperature = float(feed["field1"])
    humidity = float(feed["field2"])
    smoke = float(feed["field3"])

    return {
        "temperature": temperature,
        "humidity": humidity,
        "smoke": smoke
    }

@app.get("/predict")
def predict_fire():
    """Predict fire using ML model"""
    r = requests.get(THINGSPEAK_URL).json()
    feed = r["feeds"][0]

    temperature = float(feed["field1"])
    humidity = float(feed["field2"])
    smoke = float(feed["field3"])

    # ML prediction
    pred = model.predict([[temperature, humidity, smoke]])[0]

    return {
        "temperature": temperature,
        "humidity": humidity,
        "smoke": smoke,
        "fire_prediction": int(pred)
    }
