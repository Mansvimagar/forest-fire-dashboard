from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIG ---
THINGSPEAK_CHANNEL_ID = "YOUR_CHANNEL_ID"  # Example: "2584230"
THINGSPEAK_API_KEY = "YOUR_READ_API_KEY"
THINGSPEAK_URL = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?api_key={THINGSPEAK_API_KEY}&results=1"


# --- CLEAN SENSOR VALUES ---
def safe_value(v):
    try:
        if v is None:
            return 0
        v = float(v)
        if v > 1000:     # humidity problem fix
            v = v / 10
        return round(v, 2)
    except:
        return 0


@app.get("/")
def home():
    return {"status": "Backend Running"}


# ---------- LIVE DATA ENDPOINT ----------
@app.get("/live-data")
def live_data():
    try:
        response = requests.get(THINGSPEAK_URL)
        data = response.json()

        feed = data["feeds"][0]

        temperature = safe_value(feed.get("field1"))
        humidity = safe_value(feed.get("field2"))
        smoke = safe_value(feed.get("field3"))

        return {
            "temperature": temperature,
            "humidity": humidity,
            "smoke": smoke
        }

    except Exception as e:
        return {"error": str(e)}
