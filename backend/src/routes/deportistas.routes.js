const express = require("express");
const router = express.Router();

const {
  crearDeportista,
  listarDeportistas,
  editarDeportista,
  eliminarDeportista,
  reactivarDeportista,
  reactivarMatricula,
  desactivarMatricula,
} = require("../controllers/deportistas.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

// Listar
/**
 * @swagger
 * /deportistas:
 *   get:
 *     summary: Listar deportistas con filtros opcionales
 *     tags: [Deportistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por activos o inactivos
 *
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum:
 *             - estudiante_ucb
 *             - externo
 *         description: Filtrar por tipo de deportista
 *
 *     responses:
 *       200:
 *         description: Lista de deportistas
 */
router.get(
  "/",
  verificarToken,
  verificarRol("administrador"),
  listarDeportistas,
);

// Crear
/**
 * @swagger
 * /deportistas:
 *   post:
 *     summary: Crear deportista
 *     tags: [Deportistas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             tipo: "estudiante_ucb" # estudiante_ucb | externo
 *             nombre_completo: "Juan Perez"
 *             ci: "12345678"
 *             fecha_nacimiento: "2000-01-01"
 *             genero: "M"
 *             telefono: "77777777"
 *             email: "juan@gmail.com"
 *             direccion: "La Paz"
 *             carrera: "Ingeniería de Sistemas"
 *             semestre: 5
 *             talla_camiseta: "L"
 *     responses:
 *       200:
 *         description: Deportista creado
 */
router.post(
  "/",
  verificarToken,
  verificarRol("administrador"),
  crearDeportista,
);

// Editar
/**
 * @swagger
 * /deportistas/{id}:
 *   put:
 *     summary: Editar deportista
 *     tags: [Deportistas]
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
 *             nombre_completo: "Juan Perez Editado"
 *             ci: "12345678"
 *             fecha_nacimiento: "2000-01-01"
 *             genero: "M"
 *             telefono: "77777777"
 *             email: "juan@gmail.com"
 *             direccion: "La Paz"
 *             carrera: "Ingeniería de Sistemas"
 *             semestre: 6
 *             talla_camiseta: "XL"
 *     responses:
 *       200:
 *         description: Deportista actualizado
 */
router.put(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  editarDeportista,
);

// Eliminar
/**
 * @swagger
 * /deportistas/{id}:
 *   delete:
 *     summary: Desactivar deportista
 *     tags: [Deportistas]
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
 *         description: Deportista desactivado lógicamente
 */
router.delete(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  eliminarDeportista,
);

// Reactivar Deportista
/**
 * @swagger
 * /deportistas/{id}/reactivar:
 *   patch:
 *     summary: Reactivar deportista
 *     tags: [Deportistas]
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
 *         description: Deportista reactivado
 */
router.patch(
  "/:id/reactivar",
  verificarToken,
  verificarRol("administrador"),
  reactivarDeportista,
);

// Reactivar Matrícula
/**
 * @swagger
 * /deportistas/{id}/reactivar-matricula:
 *   patch:
 *     summary: Reactivar matrícula
 *     tags: [Deportistas]
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
 *         description: Matrícula reactivada
 */
router.patch(
  "/:id/reactivar-matricula",
  verificarToken,
  verificarRol("administrador"),
  reactivarMatricula,
);

// Desactivar Matrícula
/**
 * @swagger
 * /deportistas/{id}/desactivar-matricula:
 *   patch:
 *     summary: Desactivar matrícula
 *     tags: [Deportistas]
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
 *         description: Matrícula desactivada
 */
router.patch(
  "/:id/desactivar-matricula",
  verificarToken,
  verificarRol("administrador"),
  desactivarMatricula,
);

module.exports = router;
