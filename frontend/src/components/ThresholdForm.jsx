import { useState } from "react";
import { saveThreshold } from "../api/threshold.api";

export default function ThresholdForm({ sensorId, tipoSensor }) {
  const [operador, setOperador] = useState(">");
  const [umbral, setUmbral] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await saveThreshold({
      sensorId,
      tipoSensor,
      operador,
      umbral: Number(umbral)
    });

    alert("✅ Umbral guardado");
    setUmbral("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
      <strong>Configurar umbral</strong>
      <div>
        <select value={operador} onChange={e => setOperador(e.target.value)}>
          <option value=">">Mayor que</option>
          <option value="<">Menor que</option>
          <option value=">=">Mayor o igual</option>
          <option value="<=">Menor o igual</option>
        </select>

        <input
          type="number"
          value={umbral}
          onChange={e => setUmbral(e.target.value)}
          placeholder="Valor"
          required
        />

        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}
