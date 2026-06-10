const express = require("express");
const router = express.Router();

const {
  crearDisciplina,
  listarDisciplinas,
  editarDisciplina,
  eliminarDisciplina,
  reactivarDisciplina,
} = require("../controllers/disciplinas.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// Listar disciplinas
/**
 * @swagger
 * /disciplinas:
 *   get:
 *     summary: Listar disciplinas con filtros opcionales
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar disciplinas activas o inactivas
 *     responses:
 *       200:
 *         description: Lista de disciplinas
 */
router.get(
  "/",
  verificarToken,
  verificarRol("administrador"),
  listarDisciplinas,
);

// Crear disciplina
/**
 * @swagger
 * /disciplinas:
 *   post:
 *     summary: Crear disciplina
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Fútbol"
 *             descripcion: "Disciplina deportiva de fútbol"
 *             orden: 1
 *     responses:
 *       200:
 *         description: Disciplina creada
 */
router.post(
  "/",
  verificarToken,
  verificarRol("administrador"),
  crearDisciplina,
);

// Editar disciplina
/**
 * @swagger
 * /disciplinas/{id}:
 *   put:
 *     summary: Editar disciplina
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Fútbol 11"
 *             descripcion: "Disciplina actualizada"
 *             orden: 2
 *     responses:
 *       200:
 *         description: Disciplina actualizada
 */
router.put(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  editarDisciplina,
);

// Eliminar disciplina
/**
 * @swagger
 * /disciplinas/{id}:
 *   delete:
 *     summary: Desactivar disciplina
 *     tags: [Disciplinas]
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
 *         description: Disciplina desactivada lógicamente
 */
router.delete(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  eliminarDisciplina,
);

// Reactivar Disciplina
/**
 * @swagger
 * /disciplinas/{id}/reactivar:
 *   patch:
 *     summary: Reactivar disciplina
 *     tags: [Disciplinas]
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
 *         description: Disciplina reactivada
 */
router.patch(
  "/:id/reactivar",
  verificarToken,
  verificarRol("administrador"),
  reactivarDisciplina,
);

module.exports = router;
