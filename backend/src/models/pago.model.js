const pool = require("../config/db");

const buscarDeportistaPorEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT *
    FROM deportistas
    WHERE email = $1
    AND activo = true
    `,
    [email],
  );

  return result.rows[0];
};

const buscarConceptoPorId = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM conceptos_pago
    WHERE id = $1
    AND activo = true
    `,
    [id],
  );

  return result.rows[0];
};

const crearPagoDB = async (datos) => {
  const result = await pool.query(
    `
    INSERT INTO pagos (
      deportista_id,
      concepto_id,
      monto,
      mes,
      anio,
      fecha_pago,
      origen,
      estado,
      observaciones
    )
    VALUES (
      $1,$2,$3,$4,$5,
      CURRENT_DATE,
      $6,
      'confirmado',
      $7
    )
    RETURNING *
    `,
    datos,
  );

  return result.rows[0];
};

const guardarComprobantePago = async (pagoId, archivoPDF) => {
  await pool.query(
    `
    UPDATE pagos
    SET comprobante = $1
    WHERE id = $2
    `,
    [archivoPDF, pagoId],
  );
};

const listarPagosAdmin = async () => {
  const result = await pool.query(
    `
    SELECT p.*, d.nombre_completo
    FROM pagos p
    JOIN deportistas d
      ON p.deportista_id = d.id
    `,
  );

  return result.rows;
};

const listarPagosAdminPorDeportista = async (deportistaId) => {
  const result = await pool.query(
    `
      SELECT p.*, d.nombre_completo
      FROM pagos p
      JOIN deportistas d
        ON p.deportista_id = d.id
      WHERE p.deportista_id = $1
      `,
    [deportistaId],
  );

  return result.rows;
};

const listarPagosEstudiante = async (deportistaId) => {
  const result = await pool.query(
    `
      SELECT *
      FROM pagos
      WHERE deportista_id = $1
      `,
    [deportistaId],
  );

  return result.rows;
};

module.exports = {
  buscarDeportistaPorEmail,
  buscarConceptoPorId,
  crearPagoDB,
  guardarComprobantePago,
  listarPagosAdmin,
  listarPagosAdminPorDeportista,
  listarPagosEstudiante,
};
