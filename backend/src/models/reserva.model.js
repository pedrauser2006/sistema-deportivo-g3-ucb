const pool = require("../config/db");

const buscarDeportistaPorEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT id
    FROM deportistas
    WHERE email = $1
    AND activo = true
    `,
    [email],
  );

  return result.rows[0];
};

const verificarHorarioOcupado = async (
  espacio_id,
  fecha,
  hora_inicio,
  hora_fin,
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM reservas
    WHERE espacio_id = $1
    AND fecha = $2
    AND estado = 'confirmada'
    AND (
      hora_inicio < $4
      AND hora_fin > $3
    )
    `,
    [espacio_id, fecha, hora_inicio, hora_fin],
  );

  return result.rows;
};

const crearReservaDB = async (datos) => {
  const result = await pool.query(
    `
    INSERT INTO reservas (
      espacio_id,
      solicitante_id,
      deportista_id,
      disciplina_id,
      fecha,
      hora_inicio,
      hora_fin,
      motivo,
      estado
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,
      'confirmada'
    )
    RETURNING *
    `,
    datos,
  );

  return result.rows[0];
};

const obtenerEspacioPorId = async (id) => {
  const result = await pool.query(
    `
    SELECT nombre
    FROM espacios
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

const guardarPDFReserva = async (reservaId, archivoPDF) => {
  await pool.query(
    `
    UPDATE reservas
    SET comprobante_pdf = $1
    WHERE id = $2
    `,
    [archivoPDF, reservaId],
  );
};

const listarReservasAdmin = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM reservas
    WHERE estado = 'confirmada'
    `,
  );

  return result.rows;
};

const listarReservasAdminPorFecha = async (fecha) => {
  const result = await pool.query(
    `
      SELECT *
      FROM reservas
      WHERE fecha = $1
      AND estado = 'confirmada'
      `,
    [fecha],
  );

  return result.rows;
};

const listarReservasEstudiante = async (deportistaId) => {
  const result = await pool.query(
    `
      SELECT *
      FROM reservas
      WHERE deportista_id = $1
      AND estado = 'confirmada'
      `,
    [deportistaId],
  );

  return result.rows;
};

const listarReservasEstudiantePorFecha = async (deportistaId, fecha) => {
  const result = await pool.query(
    `
      SELECT *
      FROM reservas
      WHERE deportista_id = $1
      AND fecha = $2
      AND estado = 'confirmada'
      `,
    [deportistaId, fecha],
  );

  return result.rows;
};

const cancelarReservaAdmin = async (id) => {
  const result = await pool.query(
    `
    UPDATE reservas
    SET estado = 'cancelada'
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

const cancelarReservaEstudiante = async (id, deportistaId) => {
  const result = await pool.query(
    `
      UPDATE reservas
      SET estado = 'cancelada'
      WHERE id = $1
      AND deportista_id = $2
      RETURNING *
      `,
    [id, deportistaId],
  );

  return result.rows[0];
};

module.exports = {
  buscarDeportistaPorEmail,
  verificarHorarioOcupado,
  crearReservaDB,
  obtenerEspacioPorId,
  guardarPDFReserva,
  listarReservasAdmin,
  listarReservasAdminPorFecha,
  listarReservasEstudiante,
  listarReservasEstudiantePorFecha,
  cancelarReservaAdmin,
  cancelarReservaEstudiante,
};
