const express = require("express");
const router = express.Router();

const {
  crearReserva,
  listarReservas,
  cancelarReserva,
} = require("../controllers/reservas.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// 🔹 Listar reservas (cualquier usuario autenticado)
/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Listar reservas
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: false
 *         schema:
 *           type: string
 *           example: 2026-04-20
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get("/", listarReservas);

// 🔹 Crear reserva (solo ciertos roles)
/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             espacio_id: 1
 *             fecha: "2026-04-20"
 *             hora_inicio: "10:00"
 *             hora_fin: "11:00"
 *     responses:
 *       200:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Horario ocupado
 */

router.post("/", crearReserva);

// 🔹 Cancelar reserva
/**
 * @swagger
 * /reservas/{id}/cancelar:
 *   put:
 *     summary: Cancelar una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva cancelada correctamente
 *       404:
 *         description: Reserva no encontrada
 */
router.put("/:id/cancelar", cancelarReserva);

module.exports = router;
