const express = require("express");
const router = express.Router();

const {
  crearDisciplina,
  listarDisciplinas,
  editarDisciplina,
  eliminarDisciplina,
} = require("../controllers/disciplinas.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// 🔹 Listar disciplinas
/**
 * @swagger
 * /disciplinas:
 *   get:
 *     summary: Listar disciplinas
 *     tags: [Disciplinas]
 *     responses:
 *       200:
 *         description: Lista de disciplinas
 */
router.get("/", listarDisciplinas);

// 🔹 Crear disciplina
/**
 * @swagger
 * /disciplinas:
 *   post:
 *     summary: Crear disciplina
 *     tags: [Disciplinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Fútbol"
 *     responses:
 *       200:
 *         description: Disciplina creada
 */
router.post("/", crearDisciplina);

// 🔹 Editar disciplina
/**
 * @swagger
 * /disciplinas/{id}:
 *   put:
 *     summary: Editar disciplina
 *     tags: [Disciplinas]
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
 *     responses:
 *       200:
 *         description: Disciplina actualizada
 */
router.put("/:id", editarDisciplina);

// 🔹 Eliminar disciplina
/**
 * @swagger
 * /disciplinas/{id}:
 *   delete:
 *     summary: Eliminar disciplina
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Disciplina eliminada
 */
router.delete("/:id", eliminarDisciplina);

module.exports = router;
