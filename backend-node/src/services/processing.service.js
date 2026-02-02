async function processSensorData(data, io) {
  // Validación básica
  if (!data.sensorId || data.value === undefined) return;

  // Aquí luego:
  // - Guardar en BD
  // - Evaluar umbrales
  // - Generar alertas

  io.emit("realtime-data", data);
}

module.exports = { processSensorData };
