const pool = require("../config/db");

const crearDisciplinaDB = async (nombre, descripcion, orden) => {
  const result = await pool.query(
    `
    INSERT INTO disciplinas (
      nombre,
      descripcion,
      orden
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [nombre, descripcion, orden],
  );

  return result.rows[0];
};

const listarDisciplinasDB = async (query) => {
  const result = await pool.query(query);
  return result.rows;
};

const editarDisciplinaDB = async (id, nombre, descripcion, orden) => {
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
    [nombre, descripcion, orden, id],
  );

  return result.rows[0];
};

const desactivarDisciplinaDB = async (id) => {
  const result = await pool.query(
    `
    UPDATE disciplinas
    SET activo = FALSE
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

const reactivarDisciplinaDB = async (id) => {
  const result = await pool.query(
    `
    UPDATE disciplinas
    SET activo = TRUE
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  crearDisciplinaDB,
  listarDisciplinasDB,
  editarDisciplinaDB,
  desactivarDisciplinaDB,
  reactivarDisciplinaDB,
};
