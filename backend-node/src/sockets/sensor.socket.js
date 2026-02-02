module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    socket.on("sensor-data", (data) => {
      console.log("📥 Datos recibidos:", data);

      // Aquí luego:
      // - Validar
      // - Guardar en BD
      // - Evaluar alertas

      io.emit("sensor-update", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Cliente desconectado:", socket.id);
    });
  });
};
