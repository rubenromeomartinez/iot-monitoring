const db = require("../config/db");

/**
 * Guarda una alerta en BD
 */
exports.saveAlert = async ({ sensorId, valor, umbral, tipoAlerta }) => {
  const query = `
    INSERT INTO alertas (sensor_id, valor, umbral, tipo_alerta)
    VALUES ($1, $2, $3, $4)
  `;

  const values = [
    sensorId,
    valor,
    umbral,
    tipoAlerta // 'ALTA' | 'BAJA'
  ];

  await db.query(query, values);
};

/**
 * Obtiene todas las alertas
 */
exports.getAlerts = async () => {
  const { rows } = await db.query(`
    SELECT
      id_alerta,
      sensor_id,
      valor,
      umbral,
      tipo_alerta,
      fecha
    FROM alertas
    ORDER BY fecha DESC
  `);

  return rows;
};
