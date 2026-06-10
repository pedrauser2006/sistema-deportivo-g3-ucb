const pool = require("../config/db");

const obtenerReservasReporte = async () => {
  const result = await pool.query(`
    SELECT
      r.id,
      d.nombre_completo AS deportista,
      e.nombre AS espacio,
      di.nombre AS disciplina,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      r.estado
    FROM reservas r
    LEFT JOIN deportistas d
      ON r.deportista_id = d.id
    LEFT JOIN espacios e
      ON r.espacio_id = e.id
    LEFT JOIN disciplinas di
      ON r.disciplina_id = di.id
    ORDER BY r.id ASC
  `);

  return result.rows;
};

const obtenerPagosReporte = async () => {
  const result = await pool.query(`
    SELECT
      p.id,
      d.nombre_completo AS deportista,
      c.nombre AS concepto,
      p.monto,
      p.mes,
      p.anio,
      p.fecha_pago,
      p.estado
    FROM pagos p
    JOIN deportistas d
      ON p.deportista_id = d.id
    JOIN conceptos_pago c
      ON p.concepto_id = c.id
    ORDER BY p.id ASC
  `);

  return result.rows;
};

const obtenerDeportistasReporte = async () => {
  const result = await pool.query(`
    SELECT
      d.id,
      d.nombre_completo AS nombre,
      d.tipo,
      d.ci,
      d.carrera
    FROM deportistas d
    ORDER BY d.id
  `);

  return result.rows;
};

module.exports = {
  obtenerReservasReporte,
  obtenerPagosReporte,
  obtenerDeportistasReporte,
};
