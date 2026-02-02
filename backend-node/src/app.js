import { useEffect, useState } from "react";
import axios from "axios";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000/api";

export default function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [thresholds, setThresholds] = useState([]);

  // ========================
  // Fetch data
  // ========================
  const fetchSensors = async () => {
    const res = await axios.get(`${API_URL}/sensors`);
    setSensorData(res.data);
  };

  const fetchAlerts = async () => {
    const res = await axios.get(`${API_URL}/alerts`);
    setAlerts(res.data);
  };

  const fetchThresholds = async () => {
    const res = await axios.get(`${API_URL}/thresholds`);
    setThresholds(res.data);
  };

  useEffect(() => {
    fetchSensors();
    fetchAlerts();
    fetchThresholds();

    const interval = setInterval(() => {
      fetchSensors();
      fetchAlerts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ========================
  // Helpers
  // ========================
  const getSensorData = (tipo) =>
    sensorData.filter((d) => d.tipo_sensor === tipo);

  const getThresholdFor = (tipo) =>
    thresholds.find((t) => t.tipo_sensor === tipo);

  const calculateMetrics = (data) => {
    if (!data.length) return { max: "-", min: "-", avg: "-" };

    const values = data.map((d) => d.valor);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      max: max.toFixed(2),
      min: min.toFixed(2),
      avg: avg.toFixed(2)
    };
  };

  // ========================
  // Toasts de alertas
  // ========================
  useEffect(() => {
    alerts.forEach((alert) => {
      if (!alert._shown) {
        toast.error(
          `🚨 ${alert.tipo_alerta} | Valor: ${alert.valor} | Umbral: ${alert.umbral}`
        );
        alert._shown = true;
      }
    });
  }, [alerts]);

  // ========================
  // Render de métricas
  // ========================
  const MetricCard = ({ title, value, unit }) => (
    <div
      style={{
        background: "#1f2937",
        padding: "16px",
        borderRadius: "12px",
        color: "#fff",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}
    >
      <div style={{ fontSize: "14px", opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: "28px", fontWeight: "bold" }}>
        {value} {unit}
      </div>
    </div>
  );

  // ========================
  // Charts renderer
  // ========================
  const renderChart = (tipo, unit) => {
    const data = getSensorData(tipo);
    const threshold = getThresholdFor(tipo);
    const metrics = calculateMetrics(data);

    return (
      <div style={{ marginBottom: "40px" }}>
        {/* ===== METRICS ===== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
            marginBottom: "20px"
          }}
        >
          <MetricCard title="Máximo" value={metrics.max} unit={unit} />
          <MetricCard title="Promedio" value={metrics.avg} unit={unit} />
          <MetricCard title="Mínimo" value={metrics.min} unit={unit} />
        </div>

        {/* ===== CHART ===== */}
        <div
          style={{
            width: "100%",
            height: 300,
            background: "#111827",
            padding: "16px",
            borderRadius: "12px"
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: "10px" }}>
            {tipo.toUpperCase()}
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              {threshold && (
                <ReferenceLine
                  y={threshold.umbral}
                  stroke="red"
                  strokeDasharray="5 5"
                  label="Umbral"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // ========================
  // Render
  // ========================
  return (
    <div style={{ padding: "20px" }}>
      {renderChart("temperatura", "°C")}
      {renderChart("humedad", "%")}
    </div>
  );
}
