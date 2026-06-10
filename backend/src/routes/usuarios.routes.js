const express = require("express");
const router = express.Router();
const { listarUsuarios } = require("../controllers/usuarios.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo administradores
 */
router.get("/", verificarToken, verificarRol("administrador"), listarUsuarios);

module.exports = router;
