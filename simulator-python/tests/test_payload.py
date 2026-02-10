from simulator.simulator import generate_value, SENSORS

def test_generate_value_range():
    sensor = SENSORS[0]
    value = generate_value(sensor)
    assert sensor["min"] <= value <= sensor["max"]

def test_generate_value_type():
    value = generate_value(SENSORS[0])
    assert isinstance(value, float)
