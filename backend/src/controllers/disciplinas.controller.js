const pool = require("../config/db");

// Crear disciplina
const crearDisciplina = async (req, res) => {
  try {
    const { nombre, descripcion, orden } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: "El nombre es obligatorio",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO disciplinas (
        nombre,
        descripcion,
        orden
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [nombre, descripcion || null, orden || 0],
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

// Listar disciplinas
const listarDisciplinas = async (req, res) => {
  try {
    const { activo } = req.query;

    let query = `
      SELECT *
      FROM disciplinas
    `;

    const condiciones = [];

    if (activo === "true") {
      condiciones.push("activo = TRUE");
    }

    if (activo === "false") {
      condiciones.push("activo = FALSE");
    }

    if (condiciones.length > 0) {
      query += ` WHERE ` + condiciones.join(" AND ");
    }

    query += `
      ORDER BY orden ASC, nombre ASC
    `;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al listar disciplinas",
    });
  }
};

// Editar disciplina
const editarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, orden } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: "El nombre es obligatorio",
      });
    }

    const result = await pool.query(
      `
      UPDATE disciplinas
      SET
        nombre = $1,
        descripcion = $2,
        orden = $3
      WHERE id = $4
      RETURNING *
      `,
      [nombre, descripcion || null, orden || 0, id],
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

// Eliminar disciplina
const eliminarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE disciplinas
      SET activo = FALSE
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Disciplina no encontrada" });
    }

    res.json({
      mensaje: "Disciplina desactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al desactivar disciplina",
    });
  }
};

// Reactivar Disciplina
const reactivarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE disciplinas
      SET activo = TRUE
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Disciplina no encontrada",
      });
    }

    res.json({
      mensaje: "Disciplina reactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar disciplina",
    });
  }
};

module.exports = {
  crearDisciplina,
  listarDisciplinas,
  editarDisciplina,
  eliminarDisciplina,
  reactivarDisciplina,
};
