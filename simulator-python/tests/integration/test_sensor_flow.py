import socketio
import time
from simulator.simulator import build_payload, emit_sensor_data

def test_sensor_data_emission():
    sio = socketio.Client()
    received = False

    @sio.event
    def connect():
        pass

    @sio.on("sensor-update")
    def on_update(data):
        nonlocal received
        received = True

    sio.connect("http://localhost:4000")

    payload = {
        "sensorId": "TEMP-001",
        "type": "Temperatura",
        "value": 25.5,
        "unit": "C",
        "timestamp": "2026-01-01T00:00:00"
    }

    emit_sensor_data(sio, payload)

    time.sleep(1)
    sio.disconnect()

    assert received is True
