const pool = require("../config/db");

const buscarUsuarioPorEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.password_hash,
      r.nombre AS rol
    FROM usuarios u
    JOIN roles r
      ON u.rol_id = r.id
    WHERE u.email = $1
    `,
    [email],
  );

  return result.rows[0];
};

module.exports = {
  buscarUsuarioPorEmail,
};
