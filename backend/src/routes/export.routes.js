const express = require("express");

const router = express.Router();

const {
  exportarReservasExcel,
  exportarReservasPDF,
  exportarPagosExcel,
  exportarPagosPDF,
  exportarDeportistasExcel,
  exportarDeportistasPDF,
} = require("../controllers/export.controller");

// 🔹 Exportar reservas Excel
router.get("/reservas/excel", exportarReservasExcel);

// 🔹 Exportar reservas PDF
router.get("/reservas/pdf", exportarReservasPDF);

// 🔹 Exportar pagos Excel
router.get("/pagos/excel", exportarPagosExcel);

// 🔹 Exportar pagos PDF
router.get("/pagos/pdf", exportarPagosPDF);

// 🔹 Exportar deportistas Excel
router.get("/deportistas/excel", exportarDeportistasExcel);

router.get("/deportistas/pdf", exportarDeportistasPDF);

module.exports = router;
