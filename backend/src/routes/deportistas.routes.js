const express = require("express");
const router = express.Router();

const {
  crearDeportista,
  listarDeportistas,
  editarDeportista,
  eliminarDeportista,
} = require("../controllers/deportistas.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// 🔹 Listar
/**
 * @swagger
 * /deportistas:
 *   get:
 *     summary: Listar deportistas
 *     tags: [Deportistas]
 *     responses:
 *       200:
 *         description: Lista de deportistas
 */
router.get("/", listarDeportistas);

// 🔹 Crear
/**
 * @swagger
 * /deportistas:
 *   post:
 *     summary: Crear deportista
 *     tags: [Deportistas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             usuario_id: 5
 *             nombre_completo: "Juan Perez"
 *             ci: "123456"
 *             carrera: "Sistemas"
 *     responses:
 *       200:
 *         description: Deportista creado
 */
router.post("/", crearDeportista);

// 🔹 Editar
/**
 * @swagger
 * /deportistas/{id}:
 *   put:
 *     summary: Editar deportista
 *     tags: [Deportistas]
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
 *             nombre_completo: "Juan Perez Editado"
 *             ci: "999999"
 *             carrera: "Arquitectura"
 *     responses:
 *       200:
 *         description: Deportista actualizado
 */
router.put("/:id", editarDeportista);

// 🔹 Eliminar
/**
 * @swagger
 * /deportistas/{id}:
 *   delete:
 *     summary: Eliminar deportista
 *     tags: [Deportistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deportista eliminado
 */
router.delete("/:id", eliminarDeportista);

module.exports = router;
