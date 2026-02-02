import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const saveThreshold = (data) =>
  axios.post(`${API_URL}/thresholds`, data);

export const getThresholds = () =>
  axios.get(`${API_URL}/thresholds`);
