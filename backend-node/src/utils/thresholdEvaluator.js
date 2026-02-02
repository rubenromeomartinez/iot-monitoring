exports.evaluateThreshold = (value, operador, umbral) => {
  if (operador === ">" && value > umbral) return "ALTA";
  if (operador === "<" && value < umbral) return "BAJA";
  return null;
};