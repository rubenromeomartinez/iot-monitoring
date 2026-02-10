from simulator.simulator import emit_sensor_data
from unittest.mock import Mock

def test_emit_sensor_data_called():
    mock_socket = Mock()
    payload = {"test": "data"}

    emit_sensor_data(mock_socket, payload)

    mock_socket.emit.assert_called_once_with("sensor-data", payload)
