const pool = require("../config/db");

// 🔹 Crear deportista
const crearDeportista = async (req, res) => {
  try {
    const { usuario_id, nombre_completo, ci, carrera } = req.body;

    // 🔴 VALIDAR CAMPOS OBLIGATORIOS
    if (!usuario_id || !nombre_completo || !ci) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
      });
    }

    // 🔴 1. Verificar que el usuario exista
    const usuario = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      usuario_id,
    ]);

    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no existe" });
    }

    // 🔴 2. Verificar que sea jugador (rol_id = 4)
    if (usuario.rows[0].rol_id !== 4) {
      return res.status(400).json({
        error: "El usuario no es jugador",
      });
    }

    // 🔴 3. Verificar que no tenga ya un deportista
    const existe = await pool.query(
      "SELECT * FROM deportistas WHERE usuario_id = $1",
      [usuario_id],
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: "Este usuario ya es deportista",
      });
    }

    // 🔴 4. Insertar
    const result = await pool.query(
      `
      INSERT INTO deportistas (usuario_id, nombre_completo, ci, carrera)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [usuario_id, nombre_completo, ci, carrera],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "El CI ya está registrado",
      });
    }

    res.status(500).json({ error: "Error al crear deportista" });
  }
};

// 🔹 Listar deportistas
const listarDeportistas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.email
      FROM deportistas d
      JOIN usuarios u ON d.usuario_id = u.id
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar deportistas" });
  }
};

// 🔹 Editar deportista
const editarDeportista = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, ci, carrera } = req.body;

    // 🔴 VALIDAR DATOS
    if (!nombre_completo || !ci) {
      return res.status(400).json({
        error: "Datos incompletos",
      });
    }

    const result = await pool.query(
      `
      UPDATE deportistas
      SET nombre_completo = $1, ci = $2, carrera = $3
      WHERE id = $4
      RETURNING *
      `,
      [nombre_completo, ci, carrera, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deportista no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "El CI ya está registrado",
      });
    }

    res.status(500).json({ error: "Error al editar deportista" });
  }
};

// 🔹 Eliminar deportista
const eliminarDeportista = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM deportistas WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deportista no encontrado" });
    }

    res.json({ mensaje: "Deportista eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar deportista" });
  }
};

module.exports = {
  crearDeportista,
  listarDeportistas,
  editarDeportista,
  eliminarDeportista,
};
