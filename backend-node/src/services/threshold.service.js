const db = require("../config/db");

exports.saveThreshold = async ({ sensorId, tipoSensor, operador, umbral }) => {
  const query = `
    INSERT INTO umbrales (sensor_id, tipo_sensor, operador, umbral)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (sensor_id, tipo_sensor)
    DO UPDATE 
      SET operador = EXCLUDED.operador,
          umbral = EXCLUDED.umbral,
          activo = true
  `;

  await db.query(query, [sensorId, tipoSensor, operador, umbral]);
};

exports.getThresholds = async () => {
  const { rows } = await db.query(
    `SELECT sensor_id, tipo_sensor, operador, umbral 
     FROM umbrales 
     WHERE activo = true`
  );
  return rows;
};

exports.getThresholdsBySensor = async (sensorId) => {
  const { rows } = await db.query(
    `SELECT sensor_id, tipo_sensor, operador, umbral
     FROM umbrales
     WHERE sensor_id = $1 AND activo = true`,
    [sensorId]
  );
  return rows;
};
