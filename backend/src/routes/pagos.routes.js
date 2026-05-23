const express = require("express");
const router = express.Router();

const {
  crearPago,
  listarPagos,
  pagosPorDeportista,
  confirmarPago,
  obtenerMorosos,
} = require("../controllers/pagos.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// 🔹 Listar pagos
/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Listar pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
 */
router.get("/", listarPagos);

// 🔹 Crear pago
/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             deportista_id: 1
 *             monto: 100
 *     responses:
 *       200:
 *         description: Pago registrado
 */
router.post("/", crearPago);

// 🔹 Listar morosos
/**
 * @swagger
 * /pagos/morosos:
 *   get:
 *     summary: Listar deportistas morosos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de deportistas sin pagos
 */
router.get("/morosos", obtenerMorosos);

// 🔹 Pagos por deportista
/**
 * @swagger
 * /pagos/deportista/{id}:
 *   get:
 *     summary: Ver pagos de un deportista
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pagos del deportista
 */
router.get("/deportista/:id", pagosPorDeportista);

// 🔹 Confirmar pago
/**
 * @swagger
 * /pagos/{id}/confirmar:
 *   put:
 *     summary: Confirmar pago manualmente
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago confirmado
 */
router.put("/:id/confirmar", confirmarPago);

module.exports = router;
