const authService = require("../services/auth.service");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const resultado = await authService.login(email, password);

    res.json(resultado);
  } catch (error) {
    if (
      error.message === "Usuario no encontrado" ||
      error.message === "Contraseña incorrecta"
    ) {
      return res.status(401).json({
        error: error.message,
      });
    }

    console.error(error);

    res.status(500).json({
      error: "Error en login",
    });
  }
};

module.exports = {
  login,
};
