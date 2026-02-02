export default function AlertPanel({ alerts }) {
  if (alerts.length === 0) return null;

  return (
    <div style={{
      background: "#ffe5e5",
      border: "1px solid red",
      padding: "1rem",
      marginBottom: "1.5rem",
      borderRadius: "8px"
    }}>
      <h3>⚠️ Alertas activas</h3>

      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            <strong>{alert.sensor}</strong>: {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
