const thresholdService = require("../services/threshold.service");

exports.setThreshold = async (req, res) => {
  try {
    const { sensorId, tipoSensor, operador, umbral } = req.body;

    if (!sensorId || !tipoSensor || !operador || umbral === undefined) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    await thresholdService.saveThreshold({
      sensorId,
      tipoSensor,
      operador,
      umbral
    });

    res.json({
      message: "✅ Umbral guardado correctamente",
      sensorId,
      tipoSensor,
      operador,
      umbral
    });
  } catch (error) {
    console.error("❌ Error guardando umbral:", error.message);
    res.status(500).json({ message: "Error guardando umbral" });
  }
};

exports.getThresholds = async (_req, res) => {
  const data = await thresholdService.getThresholds();
  res.json(data);
};
