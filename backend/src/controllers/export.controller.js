const pool = require("../config/db");
const path = require("path");
const { generarExcel } = require("../utils/excel.generator");
const { generarPDFReporte } = require("../utils/pdf.generator");

// 🔹 Exportar reservas Excel
const exportarReservasExcel = async (req, res) => {
  try {
    // 🔹 Obtener reservas
    const result = await pool.query(`
      SELECT
        r.id,
        e.nombre AS espacio,
        r.fecha,
        r.hora_inicio,
        r.hora_fin,
        r.estado
      FROM reservas r
      JOIN espacios e
      ON r.espacio_id = e.id
      ORDER BY r.id ASC
    `);

    const reservas = result.rows;

    const rutaArchivo = generarExcel(reservas, "reservas.xlsx", "Reservas");

    // 🔹 Descargar
    res.download(rutaArchivo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar Excel",
    });
  }
};

// 🔹 Exportar reservas PDF
const exportarReservasPDF = async (req, res) => {
  try {
    // 🔹 Obtener reservas
    const result = await pool.query(`
      SELECT
        r.id,
        e.nombre AS espacio,
        r.fecha,
        r.hora_inicio,
        r.hora_fin,
        r.estado
      FROM reservas r
      JOIN espacios e
      ON r.espacio_id = e.id
      ORDER BY r.id ASC
    `);

    const reservas = result.rows;

    const columnas = [
      { header: "ID", key: "id" },
      { header: "ESPACIO", key: "espacio" },
      { header: "FECHA", key: "fecha" },
      { header: "INICIO", key: "hora_inicio" },
      { header: "FIN", key: "hora_fin" },
    ];

    // 🔹 Generar PDF
    const rutaPDF = await generarPDFReporte(
      "REPORTE DE RESERVAS",
      columnas,
      reservas,
      "reservas.pdf",
    );

    // 🔹 Descargar
    res.download(rutaPDF);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar PDF reservas",
    });
  }
};

// 🔹 Exportar pagos Excel
const exportarPagosExcel = async (req, res) => {
  try {
    // 🔹 Obtener pagos
    const result = await pool.query(`
      SELECT
        p.id,
        d.nombre_completo AS deportista,
        p.monto,
        p.fecha_pago,
        p.estado
      FROM pagos p
      JOIN deportistas d
      ON p.deportista_id = d.id
      ORDER BY p.id ASC
    `);

    const pagos = result.rows;

    const rutaArchivo = generarExcel(pagos, "pagos.xlsx", "Pagos");

    // 🔹 Descargar
    res.download(rutaArchivo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar pagos Excel",
    });
  }
};

// 🔹 Exportar pagos PDF
const exportarPagosPDF = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        d.nombre_completo AS deportista,
        p.monto,
        p.fecha_pago,
        p.estado
      FROM pagos p
      JOIN deportistas d
      ON p.deportista_id = d.id
      ORDER BY p.id ASC
    `);

    const pagos = result.rows;

    const columnas = [
      { header: "ID", key: "id" },
      { header: "DEPORTISTA", key: "deportista" },
      { header: "MONTO", key: "monto" },
      { header: "FECHA", key: "fecha_pago" },
      { header: "ESTADO", key: "estado" },
    ];

    const rutaPDF = await generarPDFReporte(
      "REPORTE DE PAGOS",
      columnas,
      pagos,
      "pagos.pdf",
    );

    res.download(rutaPDF);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar PDF pagos",
    });
  }
};

// 🔹 Exportar deportistas Excel
const exportarDeportistasExcel = async (req, res) => {
  try {
    // 🔹 Obtener deportistas
    const result = await pool.query(`
      SELECT
        id,
        nombre_completo,
        ci,
        carrera
      FROM deportistas
      ORDER BY id ASC
    `);

    const deportistas = result.rows;

    const rutaArchivo = generarExcel(
      deportistas,
      "deportistas.xlsx",
      "Deportistas",
    );

    // 🔹 Descargar
    res.download(rutaArchivo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar deportistas Excel",
    });
  }
};

const exportarDeportistasPDF = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.nombre_completo AS nombre,
        d.ci,
        d.carrera
      FROM deportistas d
      ORDER BY d.id
    `);

    const deportistas = result.rows;

    const columnas = [
      { header: "ID", key: "id" },
      { header: "NOMBRE", key: "nombre" },
      { header: "CI", key: "ci" },
      { header: "CARRERA", key: "carrera" },
    ];

    const rutaPDF = await generarPDFReporte(
      "REPORTE DE DEPORTISTAS",
      columnas,
      deportistas,
      "deportistas.pdf",
    );

    res.download(rutaPDF);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar PDF deportistas",
    });
  }
};

module.exports = {
  exportarReservasExcel,
  exportarReservasPDF,
  exportarPagosExcel,
  exportarPagosPDF,
  exportarDeportistasExcel,
  exportarDeportistasPDF,
};
