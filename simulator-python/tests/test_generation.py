from simulator.simulator import build_payload, SENSORS
def test_payload_structure():
    payload = build_payload(SENSORS[0])

    assert "sensorId" in payload
    assert "type" in payload
    assert "value" in payload
    assert "unit" in payload
    assert "timestamp" in payload
