import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function SensorChart({ title, labels, data, color }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>{title}</h3>
      <Line data={chartData} />
    </div>
  );
}
