const pool = require("../config/db");

// 🔹 Crear pago
const crearPago = async (req, res) => {
  try {
    const { deportista_id, monto } = req.body;

    // 🔴 Verificar que el deportista exista
    const deportista = await pool.query(
      "SELECT * FROM deportistas WHERE id = $1",
      [deportista_id],
    );

    if (deportista.rows.length === 0) {
      return res.status(404).json({ error: "Deportista no existe" });
    }

    // ✅ Insertar pago
    const result = await pool.query(
      `
      INSERT INTO pagos (deportista_id, monto, fecha_pago, estado)
      VALUES ($1, $2, NOW(), 'confirmado')
      RETURNING *
      `,
      [deportista_id, monto],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear pago" });
  }
};

// 🔹 Listar todos los pagos
const listarPagos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, d.nombre_completo
      FROM pagos p
      JOIN deportistas d ON p.deportista_id = d.id
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar pagos" });
  }
};

// 🔹 Ver pagos por deportista
const pagosPorDeportista = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM pagos
      WHERE deportista_id = $1
      `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pagos" });
  }
};

// 🔹 Confirmar pago (cambiar estado)
const confirmarPago = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE pagos
      SET estado = 'confirmado'
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    res.json({ mensaje: "Pago confirmado" });
  } catch (error) {
    res.status(500).json({ error: "Error al confirmar pago" });
  }
};

// 🔹 Obtener morosos (deportistas sin pagos)
const obtenerMorosos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*
      FROM deportistas d
      LEFT JOIN pagos p ON d.id = p.deportista_id
      WHERE p.id IS NULL
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener morosos" });
  }
};

module.exports = {
  crearPago,
  listarPagos,
  pagosPorDeportista,
  confirmarPago,
  obtenerMorosos,
};
