const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getSensors = async () => {
  const res = await fetch(`${API_URL}/sensors`);
  return res.json();
};

export const getReadings = async () => {
  const res = await fetch(`${API_URL}/sensors/readings`);
  return res.json();
};
