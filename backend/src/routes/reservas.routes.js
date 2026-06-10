const express = require("express");
const router = express.Router();

const {
  crearReserva,
  listarReservas,
  cancelarReserva,
} = require("../controllers/reservas.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// Listar reservas (cualquier usuario autenticado)
/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Listar reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No autorizado
 */
router.get(
  "/",
  verificarToken,
  verificarRol("administrador", "estudiante"),
  listarReservas,
);

// Crear reserva (solo ciertos roles)
/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una reserva (solo estudiantes)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             espacio_id: 1
 *             disciplina_id: 1
 *             fecha: "2026-04-20"
 *             hora_inicio: "10:00"
 *             hora_fin: "11:00"
 *             motivo: "Entrenamiento de básquet"
 *     responses:
 *       200:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Horario ocupado
 *       403:
 *         description: El usuario no está registrado como deportista o no tiene permisos
 */

router.post("/", verificarToken, verificarRol("estudiante"), crearReserva);

// Cancelar reserva
/**
 * @swagger
 * /reservas/{id}/cancelar:
 *   put:
 *     summary: Cancelar una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva cancelada correctamente
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No autorizado para cancelar esta reserva
 *       404:
 *         description: Reserva no encontrada
 */
router.put(
  "/:id/cancelar",
  verificarToken,
  verificarRol("administrador", "estudiante"),
  cancelarReserva,
);

module.exports = router;
