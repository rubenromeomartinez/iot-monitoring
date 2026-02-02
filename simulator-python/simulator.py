import socketio
import time
import random
from datetime import datetime
import os

WS_URL = os.getenv("WS_BACKEND_URL", "http://backend:4000")

sio = socketio.Client()

SENSORS = [
    {
        "sensorId": "TEMP-001",
        "type": "Temperatura",
        "unit": "C",
        "min": 18,
        "max": 35,
        "interval": 5
    },
    {
        "sensorId": "HUM-001",
        "type": "Humedad",
        "unit": "%",
        "min": 40,
        "max": 80,
        "interval": 7
    }
]

def generate_value(sensor):
    return round(random.uniform(sensor["min"], sensor["max"]), 2)

@sio.event
def connect():
    print("🟢 Simulador conectado al backend")

@sio.event
def disconnect():
    print("🔴 Simulador desconectado")

def run_simulation():
    sio.connect(WS_URL)

    while True:
        for sensor in SENSORS:
            data = {
                "sensorId": sensor["sensorId"],
                "type": sensor["type"],
                "value": generate_value(sensor),
                "unit": sensor["unit"],
                "timestamp": datetime.utcnow().isoformat()
            }

            sio.emit("sensor-data", data)
            print("📤 Enviado:", data)

            time.sleep(sensor["interval"])

if __name__ == "__main__":
    run_simulation()
