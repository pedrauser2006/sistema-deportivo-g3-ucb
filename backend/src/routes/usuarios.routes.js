const express = require("express");
const router = express.Router();
const pool = require("../config/db");

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
router.get(
  "/",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    const result = await pool.query(`
      SELECT
        u.id,
        u.nombre_completo,
        u.email,
        r.nombre AS rol,
        u.activo
      FROM usuarios u
      JOIN roles r
        ON u.rol_id = r.id
      ORDER BY u.id
    `);

    res.json(result.rows);
  },
);

module.exports = router;
