import socketio
import time
import requests

API_URL = "http://localhost:4000/api"
WS_URL = "http://localhost:4000"

def test_alert_generation():
    # 1️⃣ Configurar umbral
    res = requests.post(f"{API_URL}/thresholds", json={
        "sensorId": "TEMP-001",
        "tipoSensor": "Temperatura",
        "operador": ">",
        "umbral": 20
    })
    assert res.status_code == 200

    # 2️⃣ Escuchar alertas
    sio = socketio.Client()
    alert_received = False

    @sio.on("alert")
    def on_alert(data):
        nonlocal alert_received
        alert_received = True

    sio.connect(WS_URL)

    # 3️⃣ Enviar valor que cruce umbral
    sio.emit("sensor-data", {
        "sensorId": "TEMP-001",
        "type": "Temperatura",
        "value": 35,
        "unit": "C",
        "timestamp": "2026-01-01T00:00:00"
    })

    time.sleep(1)
    sio.disconnect()

    assert alert_received is True
