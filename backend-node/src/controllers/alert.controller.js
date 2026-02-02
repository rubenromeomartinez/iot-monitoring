const alertService = require("../services/alert.service");

/**
 * GET /api/alerts
 * Historial de alertas disparadas
 */
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await alertService.getAlerts();
    res.json(alerts);
  } catch (error) {
    console.error("❌ Error obteniendo alertas:", error.message);
    res.status(500).json({ message: "Error obteniendo alertas" });
  }
};
