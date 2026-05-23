const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // 2. Validar password (por ahora simple)
    const bcrypt = require("bcrypt");

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // 3. Generar token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    // 4. Respuesta
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
};

module.exports = { login };
