const express = require("express");
const router = express.Router();

const { crearPago, listarPagos } = require("../controllers/pagos.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// 🔹 Listar pagos
/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Listar pagos
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deportista_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtro usado por administrador
 *     responses:
 *       200:
 *         description: Lista de pagos
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No autorizado
 */
router.get(
  "/",
  verificarToken,
  verificarRol("administrador", "estudiante"),
  listarPagos,
);

// 🔹 Crear pago
/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar pago (solo estudiantes)
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             concepto_id: 1
 *             mes: 6
 *             anio: 2026
 *             origen: "web"
 *             observaciones: "Pago realizado mediante QR"
 *     responses:
 *       200:
 *         description: Pago registrado correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Usuario no autorizado o no registrado como deportista
 */
router.post("/", verificarToken, verificarRol("estudiante"), crearPago);

module.exports = router;
