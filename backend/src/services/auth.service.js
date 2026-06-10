const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { buscarUsuarioPorEmail } = require("../models/auth.model");

const login = async (email, password) => {
  const user = await buscarUsuarioPorEmail(email);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      rol: user.rol,
    },
  };
};

module.exports = {
  login,
};
