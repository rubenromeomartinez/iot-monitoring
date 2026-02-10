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

# =========================
# LÓGICA TESTEABLE
# =========================

def generate_value(sensor):
    """Genera un valor aleatorio dentro del rango del sensor"""
    return round(random.uniform(sensor["min"], sensor["max"]), 2)

def build_payload(sensor):
    """Construye el payload del sensor"""
    return {
        "sensorId": sensor["sensorId"],
        "type": sensor["type"],
        "value": generate_value(sensor),
        "unit": sensor["unit"],
        "timestamp": datetime.utcnow().isoformat()
    }

def emit_sensor_data(socket, payload):
    """Envía los datos por socket"""
    socket.emit("sensor-data", payload)

def generate_value(sensor: dict) -> float:
    """
    Genera un valor aleatorio dentro del rango del sensor
    """
    return round(random.uniform(sensor["min"], sensor["max"]),2)

@sio.event
def connect():
    print("🟢 Simulador conectado al backend")

@sio.event
def disconnect():
    print("🔴 Simulador desconectado")

def run_simulation(socket=sio, sensors=SENSORS):
    sio.connect(WS_URL)

    while True:
        for sensor in sensors:
            payload = build_payload(sensor)
            emit_sensor_data(socket, payload)
            print("📤 Enviado:", payload)
            time.sleep(sensor["interval"])

if __name__ == "__main__":
    run_simulation()
