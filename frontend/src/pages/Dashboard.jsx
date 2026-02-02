import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../services/socket.service";
import { toast } from "react-toastify";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   UTILIDADES
==========================*/
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const calcStats = (data) => {
  if (!data.length) return { max: "-", min: "-", avg: "-" };
  const values = data.map(d => Number(d.value));
  return {
    max: Math.max(...values).toFixed(2),
    min: Math.min(...values).toFixed(2),
    avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
  };
};

const getAlertState = (avg, threshold) => {
  if (!threshold || avg === "-") return "normal";
  if (threshold.operador === ">" && avg > threshold.umbral) return "high";
  if (threshold.operador === "<" && avg < threshold.umbral) return "low";
  return "normal";
};

/* =========================
   CARD MÉTRICA
==========================*/
const StatCard = ({ label, value, unit, state }) => {
  const bg = {
    normal: "#fafafa",
    high: "#fff1f0",
    low: "#f6ffed"
  };

  const border = {
    normal: "#d9d9d9",
    high: "#ff4d4f",
    low: "#52c41a"
  };

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: bg[state],
        border: `2px solid ${border[state]}`,
        textAlign: "center",
        transition: "all .3s ease",
        boxShadow:
          state === "normal"
            ? "0 2px 6px rgba(0,0,0,.08)"
            : "0 0 14px rgba(0,0,0,.2)"
      }}
    >
      <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>
        {value} {unit}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [thresholds, setThresholds] = useState([]);

  const [form, setForm] = useState({
    sensorId: "TEMP-001",
    operador: ">",
    umbral: ""
  });

  /* =========================
     CARGA INICIAL
  ==========================*/
  useEffect(() => {
    loadAlerts();
    loadThresholds();
  }, []);

  /* =========================
     SOCKETS
  ==========================*/
  useEffect(() => {
    socket.on("sensor-update", (data) => {
      setReadings(prev => [...prev.slice(-19), data]);
    });

    socket.on("alert", (alert) => {
      // ✅ CAMPOS CORRECTOS
      toast.error(
        `🚨 ${alert.sensorId} (${alert.tipoAlerta})
Valor: ${alert.valor} | Umbral: ${alert.umbral}`
      );

      loadAlerts();
    });

    return () => {
      socket.off("sensor-update");
      socket.off("alert");
    };
  }, []);

  /* =========================
     API
  ==========================*/
  const loadAlerts = async () => {
    const res = await axios.get(`${API_URL}/alerts`);
    setAlerts(res.data);
  };

  const loadThresholds = async () => {
    const res = await axios.get(`${API_URL}/thresholds`);
    setThresholds(res.data);
  };

  const saveThreshold = async () => {
    await axios.post(`${API_URL}/thresholds`, {
      sensorId: form.sensorId,
      tipoSensor: form.sensorId.startsWith("TEMP")
        ? "Temperatura"
        : "Humedad",
      operador: form.operador,
      umbral: Number(form.umbral)
    });

    toast.success("✅ Umbral guardado correctamente");
    loadThresholds();
    setForm({ ...form, umbral: "" });
  };

  /* =========================
     DATOS
  ==========================*/
  const tempData = readings.filter(r => r.type === "Temperatura");
  const humData = readings.filter(r => r.type === "Humedad");

  const tempStats = calcStats(tempData);
  const humStats = calcStats(humData);

  const tempThreshold = thresholds.find(t => t.sensor_id === "TEMP-001");
  const humThreshold = thresholds.find(t => t.sensor_id === "HUM-001");

  /* =========================
     UI
  ==========================*/
  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Dashboard IoT</h2>

      {/* ===== TEMPERATURA ===== */}
      <h3>🌡️ Temperatura</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        <StatCard label="Máx" value={tempStats.max} unit="°C"
          state={getAlertState(Number(tempStats.avg), tempThreshold)} />
        <StatCard label="Promedio" value={tempStats.avg} unit="°C"
          state={getAlertState(Number(tempStats.avg), tempThreshold)} />
        <StatCard label="Mín" value={tempStats.min} unit="°C"
          state={getAlertState(Number(tempStats.avg), tempThreshold)} />
      </div>

      <div style={{ height: 300, margin: "20px 0" }}>
        <ResponsiveContainer>
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line dataKey="value" stroke="#ff4d4f" />
            {tempThreshold && (
              <ReferenceLine
                y={tempThreshold.umbral}
                stroke="orange"
                strokeDasharray="5 5"
                label={`Umbral ${tempThreshold.operador} ${tempThreshold.umbral}`}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== HUMEDAD ===== */}
      <h3>💧 Humedad</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        <StatCard label="Máx" value={humStats.max} unit="%"
          state={getAlertState(Number(humStats.avg), humThreshold)} />
        <StatCard label="Promedio" value={humStats.avg} unit="%"
          state={getAlertState(Number(humStats.avg), humThreshold)} />
        <StatCard label="Mín" value={humStats.min} unit="%"
          state={getAlertState(Number(humStats.avg), humThreshold)} />
      </div>

      <div style={{ height: 300, margin: "20px 0" }}>
        <ResponsiveContainer>
          <LineChart data={humData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line dataKey="value" stroke="#1890ff" />
            {humThreshold && (
              <ReferenceLine
                y={humThreshold.umbral}
                stroke="orange"
                strokeDasharray="5 5"
                label={`Umbral ${humThreshold.operador} ${humThreshold.umbral}`}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== CONFIG UMBRALES ===== */}
      <h3>⚙️ Configurar umbral</h3>

      <select
        value={form.sensorId}
        onChange={e => setForm({ ...form, sensorId: e.target.value })}
      >
        <option value="TEMP-001">Temperatura</option>
        <option value="HUM-001">Humedad</option>
      </select>

      <select
        value={form.operador}
        onChange={e => setForm({ ...form, operador: e.target.value })}
      >
        <option value=">">Mayor que</option>
        <option value="<">Menor que</option>
      </select>

      <input
        type="number"
        placeholder="Umbral"
        value={form.umbral}
        onChange={e => setForm({ ...form, umbral: e.target.value })}
      />

      <button onClick={saveThreshold}>Guardar</button>

      {/* ===== ALERTAS ===== */}
      <h3 style={{ marginTop: 30 }}>🚨 Alertas</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th style={{ padding: 10 }}>Fecha</th>
            <th style={{ padding: 10 }}>Sensor</th>
            <th style={{ padding: 10 }}>Valor</th>
            <th style={{ padding: 10 }}>Umbral</th>
            <th style={{ padding: 10 }}>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr
              key={a.id_alerta}
              style={{
                background:
                  a.tipo_alerta === "ALTA" ? "#fff1f0" : "#f6ffed"
              }}
            >
              <td style={{ padding: 8 }}>{formatDate(a.fecha)}</td>
              <td style={{ padding: 8 }}>{a.sensor_id}</td>
              <td style={{ padding: 8 }}>{a.valor}</td>
              <td style={{ padding: 8 }}>{a.umbral}</td>
              <td
                style={{
                  padding: 8,
                  fontWeight: "bold",
                  color:
                    a.tipo_alerta === "ALTA" ? "#cf1322" : "#389e0d"
                }}
              >
                {a.tipo_alerta}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
