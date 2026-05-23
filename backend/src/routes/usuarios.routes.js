const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/role.middleware");

router.get("/", verificarToken, verificarRol(1), async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios");
  res.json(result.rows);
});

module.exports = router;
