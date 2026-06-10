const pool = require("../config/db");

const crearDeportistaDB = async (datos) => {
  const result = await pool.query(
    `INSERT INTO deportistas (
      tipo,nombre_completo,ci,fecha_nacimiento,
      genero,telefono,email,direccion,
      carrera,semestre,matricula_activa,
      ultima_validacion_matricula,talla_camiseta
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    )
    RETURNING *`,
    datos,
  );

  return result.rows[0];
};

const listarDeportistasDB = async (query, params) => {
  const result = await pool.query(query, params);
  return result.rows;
};

const editarDeportistaDB = async (datos) => {
  const result = await pool.query(
    `
    UPDATE deportistas
    SET
      nombre_completo = $1,
      ci = $2,
      fecha_nacimiento = $3,
      genero = $4,
      telefono = $5,
      email = $6,
      direccion = $7,
      carrera = $8,
      semestre = $9,
      talla_camiseta = $10
    WHERE id = $11
    RETURNING *
    `,
    datos,
  );

  return result.rows[0];
};

const desactivarDeportistaDB = async (id) => {
  const result = await pool.query(
    `
    UPDATE deportistas
    SET activo = FALSE
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

const reactivarDeportistaDB = async (id) => {
  const result = await pool.query(
    `
    UPDATE deportistas
    SET activo = TRUE
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

const reactivarMatriculaDB = async (id) => {
  const result = await pool.query(
    `
    UPDATE deportistas
    SET
      matricula_activa = TRUE,
      ultima_validacion_matricula = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

const desactivarMatriculaDB = async (id) => {
  const result = await pool.query(
    `
    UPDATE deportistas
    SET matricula_activa = FALSE
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  crearDeportistaDB,
  listarDeportistasDB,
  editarDeportistaDB,
  desactivarDeportistaDB,
  reactivarDeportistaDB,
  reactivarMatriculaDB,
  desactivarMatriculaDB,
};
