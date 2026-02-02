const sensorService = require("../services/sensor.service");

/**
 * GET /api/sensors
 * Lista sensores disponibles (derivados de lecturas)
 */
exports.getSensors = async (req, res) => {
  try {
    const sensors = await sensorService.getSensors();
    res.status(200).json(sensors);
  } catch (error) {
    console.error("❌ Error al obtener sensores:", error.message);
    res.status(500).json({
      message: "Error al obtener sensores"
    });
  }
};

/**
 * GET /api/sensors/readings
 * Obtiene lecturas históricas de sensores
 */
exports.getReadings = async (req, res) => {
  try {
    const readings = await sensorService.getReadings();
    res.status(200).json(readings);
  } catch (error) {
    console.error("❌ Error al obtener lecturas:", error.message);
    res.status(500).json({
      message: "Error al obtener lecturas de sensores"
    });
  }
};
