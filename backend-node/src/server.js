require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

// App Express
const app = express();
app.use(cors());
app.use(express.json());

// Rutas HTTP
app.use("/api/sensors", require("./routes/sensor.routes"));
app.use("/api/alerts", require("./routes/alert.routes"));
app.use("/api/thresholds", require("./routes/threshold.routes"));

// Servicios
const sensorService = require("./services/sensor.service");
const alertService = require("./services/alert.service");
const thresholdService = require("./services/threshold.service");

// Servidor HTTP
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ==============================
// EVENTOS WEBSOCKET
// ==============================
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("sensor-data", async (data) => {
    try {
      console.log("📥 Datos recibidos:", data);

      // 1️⃣ Guardar lectura
      await sensorService.saveReading(data);

      // 2️⃣ Obtener umbrales activos del sensor
      const thresholds = await thresholdService.getThresholdsBySensor(
        data.sensorId
      );

      // 3️⃣ Evaluar umbrales
      for (const t of thresholds) {
        const supera =
          (t.operador === ">" && data.value > t.umbral) ||
          (t.operador === "<" && data.value < t.umbral);

        if (supera) {
          const alertPayload = {
            sensorId: data.sensorId,
            valor: data.value,
            umbral: t.umbral,
            tipoAlerta: t.operador === ">" ? "ALTA" : "BAJA"
          };

          // 4️⃣ Guardar alerta
          await alertService.saveAlert(alertPayload);

          // 5️⃣ Emitir alerta en tiempo real
          io.emit("alert", alertPayload);
        }
      }

      // 6️⃣ Emitir actualización de sensores
      io.emit("sensor-update", data);

    } catch (error) {
      console.error("❌ Error procesando datos:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// ==============================
// ARRANQUE
// ==============================
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en puerto ${PORT}`);
});
