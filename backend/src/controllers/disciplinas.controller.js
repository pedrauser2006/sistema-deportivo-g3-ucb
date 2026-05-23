const pool = require("../config/db");

// 🔹 Crear disciplina
const crearDisciplina = async (req, res) => {
  try {
    const { nombre } = req.body;

    const result = await pool.query(
      "INSERT INTO disciplinas (nombre) VALUES ($1) RETURNING *",
      [nombre],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "La disciplina ya existe",
      });
    }

    res.status(500).json({ error: "Error al crear disciplina" });
  }
};

// 🔹 Listar disciplinas
const listarDisciplinas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM disciplinas");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar disciplinas" });
  }
};

// 🔹 Editar disciplina
const editarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const result = await pool.query(
      "UPDATE disciplinas SET nombre = $1 WHERE id = $2 RETURNING *",
      [nombre, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Disciplina no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "La disciplina ya existe",
      });
    }

    res.status(500).json({ error: "Error al editar disciplina" });
  }
};

// 🔹 Eliminar disciplina
const eliminarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM disciplinas WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Disciplina no encontrada" });
    }

    res.json({ mensaje: "Disciplina eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar disciplina" });
  }
};

module.exports = {
  crearDisciplina,
  listarDisciplinas,
  editarDisciplina,
  eliminarDisciplina,
};
