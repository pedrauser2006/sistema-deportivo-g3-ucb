const exportService = require("../services/export.service");

// Reservas Excel

const exportarReservasExcel = async (req, res) => {
  try {
    const rutaArchivo = await exportService.exportarReservasExcel();

    res.download(rutaArchivo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar Excel",
    });
  }
};

// Reservas PDF

const exportarReservasPDF = async (req, res) => {
  try {
    const rutaPDF = await exportService.exportarReservasPDF();

    res.download(rutaPDF);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar PDF reservas",
    });
  }
};

// Pagos Excel

const exportarPagosExcel = async (req, res) => {
  try {
    const rutaArchivo = await exportService.exportarPagosExcel();

    res.download(rutaArchivo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar pagos Excel",
    });
  }
};

// Pagos PDF

const exportarPagosPDF = async (req, res) => {
  try {
    const rutaPDF = await exportService.exportarPagosPDF();

    res.download(rutaPDF);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar PDF pagos",
    });
  }
};

// Deportistas Excel

const exportarDeportistasExcel = async (req, res) => {
  try {
    const rutaArchivo = await exportService.exportarDeportistasExcel();

    res.download(rutaArchivo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al exportar deportistas Excel",
    });
  }
};

// Deportistas PDF

const exportarDeportistasPDF = async (req, res) => {
  try {
    const rutaPDF = await exportService.exportarDeportistasPDF();

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
