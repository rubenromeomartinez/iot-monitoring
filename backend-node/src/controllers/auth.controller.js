exports.login = (req, res) => {
  const { email, password } = req.body;

  // Simulación de autenticación
  if (email && password) {
    return res.json({
      token: "fake-jwt-token",
      user: { email, role: "USER" }
    });
  }

  return res.status(400).json({ message: "Credenciales inválidas" });
};
