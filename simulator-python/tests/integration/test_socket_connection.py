import requests
import socketio
import os

WS_URL = os.getenv("WS_BACKEND_URL", "http://localhost:4000")

def test_socket_connection():
    sio = socketio.Client()
    connected = False

    @sio.event
    def connect():
        nonlocal connected
        connected = True

    sio.connect(WS_URL)
    sio.disconnect()

    assert connected is True

def test_alert_persistence():
    res = requests.get("http://localhost:4000/api/alerts")
    assert res.status_code == 200
    assert len(res.json()) > 0
