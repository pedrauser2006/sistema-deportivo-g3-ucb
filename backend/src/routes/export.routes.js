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

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// Exportar reservas Excel
/**
 * @swagger
 * /export/reservas/excel:
 *   get:
 *     summary: Exportar reporte de reservas en Excel
 *     tags: [Exportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo Excel generado correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo administradores
 */
router.get(
  "/reservas/excel",
  verificarToken,
  verificarRol("administrador"),
  exportarReservasExcel,
);

// Exportar reservas PDF
/**
 * @swagger
 * /export/reservas/pdf:
 *   get:
 *     summary: Exportar reporte de reservas en PDF
 *     tags: [Exportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo administradores
 */
router.get(
  "/reservas/pdf",
  verificarToken,
  verificarRol("administrador"),
  exportarReservasPDF,
);

// Exportar pagos Excel
/**
 * @swagger
 * /export/pagos/excel:
 *   get:
 *     summary: Exportar reporte de pagos en Excel
 *     tags: [Exportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo Excel generado correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo administradores
 */
router.get(
  "/pagos/excel",
  verificarToken,
  verificarRol("administrador"),
  exportarPagosExcel,
);

// Exportar pagos PDF
/**
 * @swagger
 * /export/pagos/pdf:
 *   get:
 *     summary: Exportar reporte de pagos en PDF
 *     tags: [Exportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo administradores
 */
router.get(
  "/pagos/pdf",
  verificarToken,
  verificarRol("administrador"),
  exportarPagosPDF,
);

// Exportar deportistas Excel
/**
 * @swagger
 * /export/deportistas/excel:
 *   get:
 *     summary: Exportar reporte de deportistas en Excel
 *     tags: [Exportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo Excel generado correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo administradores
 */
router.get(
  "/deportistas/excel",
  verificarToken,
  verificarRol("administrador"),
  exportarDeportistasExcel,
);

// Exportar deportistas PDF
/**
 * @swagger
 * /export/deportistas/pdf:
 *   get:
 *     summary: Exportar reporte de deportistas en PDF
 *     tags: [Exportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo administradores
 */
router.get(
  "/deportistas/pdf",
  verificarToken,
  verificarRol("administrador"),
  exportarDeportistasPDF,
);

module.exports = router;
