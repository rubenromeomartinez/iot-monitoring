from simulator.simulator import generate_value,build_payload, SENSORS
from datetime import datetime

def test_generate_value_range():
    sensor = SENSORS[0]
    value = generate_value(sensor)
    assert sensor["min"] <= value <= sensor["max"]

def test_generate_value_type():
    value = generate_value(SENSORS[0])
    assert isinstance(value, float)

def test_payload_structure():
    sensor = SENSORS[0]
    payload = build_payload(sensor)

    assert set(payload.keys()) == {
        "sensorId", "type", "value", "unit", "timestamp"
    }

    assert isinstance(payload["sensorId"], str)
    assert isinstance(payload["value"], float)

def test_timestamp_format():
    sensor = SENSORS[0]
    payload = build_payload(sensor)

    parsed = datetime.fromisoformat(payload["timestamp"])
    assert isinstance(parsed, datetime)