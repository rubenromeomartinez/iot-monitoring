const db = require("../config/db");

/**
 * Guarda una lectura de sensor simulado en la base de datos
 * @param {Object} data
 * @param {string} data.sensorId
 * @param {string} data.type
 * @param {number} data.value
 * @param {string} data.unit
 * @param {string} data.timestamp
 */
exports.saveReading = async (data) => {
  const query = `
    INSERT INTO lecturas (
      sensor_id,
      tipo_sensor,
      valor,
      unidad,
      timestamp
    )
    VALUES ($1, $2, $3, $4, $5)
  `;

  const values = [
    data.sensorId,
    data.type,
    data.value,
    data.unit,
    data.timestamp
  ];

  await db.query(query, values);
};

/**
 * Obtiene lecturas históricas de sensores
 */
exports.getReadings = async () => {
  const query = `
    SELECT
      id_lectura,
      sensor_id,
      tipo_sensor,
      valor,
      unidad,
      timestamp,
      fecha_creacion
    FROM lecturas
    ORDER BY timestamp DESC
    LIMIT 100
  `;

  const { rows } = await db.query(query);
  return rows;
};

exports.getSensors = async () => {
  const query = `
    SELECT DISTINCT
      sensor_id,
      tipo_sensor,
      unidad
    FROM lecturas
    ORDER BY sensor_id
  `;

  const { rows } = await db.query(query);
  return rows;
};
