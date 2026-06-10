const { generarExcel } = require("../utils/excel.generator");
const { generarPDFReporte } = require("../utils/pdf.generator");

const {
  obtenerReservasReporte,
  obtenerPagosReporte,
  obtenerDeportistasReporte,
} = require("../models/export.model");

// Reservas Excel

const exportarReservasExcel = async () => {
  const reservas = await obtenerReservasReporte();

  return generarExcel(reservas, "reservas.xlsx", "Reservas");
};

// Reservas PDF

const exportarReservasPDF = async () => {
  const reservas = await obtenerReservasReporte();

  const columnas = [
    { header: "ID", key: "id" },
    { header: "DEPORTE", key: "disciplina" },
    { header: "DEPORTISTA", key: "deportista" },
    { header: "ESPACIO", key: "espacio" },
    { header: "FECHA", key: "fecha" },
  ];

  return await generarPDFReporte(
    "REPORTE DE RESERVAS",
    columnas,
    reservas,
    "reservas.pdf",
  );
};

// Pagos Excel

const exportarPagosExcel = async () => {
  const pagos = await obtenerPagosReporte();

  return generarExcel(pagos, "pagos.xlsx", "Pagos");
};

// Pagos PDF

const exportarPagosPDF = async () => {
  const pagos = await obtenerPagosReporte();

  const columnas = [
    { header: "ID", key: "id" },
    { header: "DEPORTISTA", key: "deportista" },
    { header: "CONCEPTO", key: "concepto" },
    { header: "MONTO", key: "monto" },
    { header: "FECHA", key: "fecha_pago" },
  ];

  return await generarPDFReporte(
    "REPORTE DE PAGOS",
    columnas,
    pagos,
    "pagos.pdf",
  );
};

// Deportistas Excel

const exportarDeportistasExcel = async () => {
  const deportistas = await obtenerDeportistasReporte();

  return generarExcel(deportistas, "deportistas.xlsx", "Deportistas");
};

// Deportistas PDF

const exportarDeportistasPDF = async () => {
  const deportistas = await obtenerDeportistasReporte();

  const columnas = [
    { header: "ID", key: "id" },
    { header: "NOMBRE", key: "nombre" },
    { header: "TIPO", key: "tipo" },
    { header: "CI", key: "ci" },
    { header: "CARRERA", key: "carrera" },
  ];

  return await generarPDFReporte(
    "REPORTE DE DEPORTISTAS",
    columnas,
    deportistas,
    "deportistas.pdf",
  );
};

module.exports = {
  exportarReservasExcel,
  exportarReservasPDF,
  exportarPagosExcel,
  exportarPagosPDF,
  exportarDeportistasExcel,
  exportarDeportistasPDF,
};
