from simulator.simulator import build_payload,generate_value,SENSORS
import pytest

def test_payload_structure():
    payload = build_payload(SENSORS[0])

    assert "sensorId" in payload
    assert "type" in payload
    assert "value" in payload
    assert "unit" in payload
    assert "timestamp" in payload

def test_generate_value_edge_min():
    sensor = {"min": 10, "max": 10}
    value = generate_value(sensor)
    assert value == 10

def test_generate_value_negative_range():
    sensor = {"min": -10, "max": 10}
    value = generate_value(sensor)
    assert -10 <= value <= 10

def test_generate_value_missing_min():
    sensor = {"max": 20}
    with pytest.raises(KeyError):
        generate_value(sensor)

def test_generate_value_does_not_modify_sensor():
    sensor = SENSORS[0]
    original = sensor.copy()
    generate_value(sensor)
    assert sensor == original

def test_generate_value_fast():
    sensor = SENSORS[0]
    for _ in range(1000):
        generate_value(sensor)