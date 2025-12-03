# backend/ml_train.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

BASE = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(BASE, "forest_data.csv")

# If dataset missing, create a small synthetic one
if not os.path.exists(csv_path):
    df = pd.DataFrame([
        {"temperature":30, "humidity":60, "smoke":100, "fire":0},
        {"temperature":28, "humidity":55, "smoke":90, "fire":0},
        {"temperature":40, "humidity":45, "smoke":200, "fire":1},
        {"temperature":46, "humidity":28, "smoke":350, "fire":1},
        {"temperature":50, "humidity":22, "smoke":400, "fire":1},
        {"temperature":35, "humidity":70, "smoke":120, "fire":0},
        {"temperature":33, "humidity":65, "smoke":110, "fire":0},
        {"temperature":45, "humidity":30, "smoke":250, "fire":1},
        {"temperature":38, "humidity":40, "smoke":180, "fire":1},
        {"temperature":31, "humidity":58, "smoke":95, "fire":0},
    ])
    df.to_csv(csv_path, index=False)
    print("✔ Synthetic dataset created at", csv_path)

df = pd.read_csv(csv_path)

# Ensure required columns exist
required = ["temperature", "humidity", "smoke", "fire"]
for c in required:
    if c not in df.columns:
        raise SystemExit(f"Missing column in CSV: {c}")

X = df[["temperature", "humidity", "smoke"]]
y = df["fire"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

acc = model.score(X_test, y_test)
print(f"Model trained. Test accuracy: {acc:.3f}")

model_path = os.path.join(BASE, "model.pkl")
joblib.dump(model, model_path)
print("✔ Model saved to", model_path)
