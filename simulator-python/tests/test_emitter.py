from simulator.simulator import emit_sensor_data,SENSORS
from unittest.mock import Mock
from unittest.mock import MagicMock

def test_emit_sensor_data_called():
    mock_socket = Mock()
    payload = {"test": "data"}

    emit_sensor_data(mock_socket, payload)

    mock_socket.emit.assert_called_once_with("sensor-data", payload)

def test_emit_sensor_data():
    mock_socket = MagicMock()
    payload = {"test": "data"}

    emit_sensor_data(mock_socket, payload)

    mock_socket.emit.assert_called_once_with("sensor-data", payload)

def test_sensors_definition():
    assert isinstance(SENSORS, list)
    assert len(SENSORS) > 0

    for sensor in SENSORS:
        assert "sensorId" in sensor
        assert "min" in sensor
        assert "max" in sensor
