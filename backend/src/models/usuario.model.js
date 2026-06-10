const pool = require("../config/db");

const listarUsuariosDB = async () => {
  const result = await pool.query(`
    SELECT
      u.id,
      u.nombre_completo,
      u.email,
      r.nombre AS rol,
      u.activo
    FROM usuarios u
    JOIN roles r
      ON u.rol_id = r.id
    ORDER BY u.id
  `);

  return result.rows;
};

module.exports = {
  listarUsuariosDB,
};
