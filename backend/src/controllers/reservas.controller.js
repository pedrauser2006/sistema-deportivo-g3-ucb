const pool = require("../config/db");
const path = require("path");
const transporter = require("../utils/mailer");
const { generarPDFReserva } = require("../utils/pdf.generator");

// 🔹 Crear reserva
const crearReserva = async (req, res) => {
  try {
    const { espacio_id, fecha, hora_inicio, hora_fin, email } = req.body;

    // 🔴 VALIDACIÓN: evitar solapamiento
    const existe = await pool.query(
      `
      SELECT * FROM reservas
      WHERE espacio_id = $1
      AND fecha = $2
      AND estado = 'activa'
      AND (
        hora_inicio < $4 AND
        hora_fin > $3
      )
      `,
      [espacio_id, fecha, hora_inicio, hora_fin],
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: "El horario ya está ocupado",
      });
    }

    // ✅ Insertar reserva
    const nueva = await pool.query(
      `
      INSERT INTO reservas (espacio_id, fecha, hora_inicio, hora_fin)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [espacio_id, fecha, hora_inicio, hora_fin],
    );

    const reservaCreada = nueva.rows[0];

    // 🔹 Obtener nombre del espacio
    const espacio = await pool.query(
      "SELECT nombre FROM espacios WHERE id = $1",
      [reservaCreada.espacio_id],
    );

    reservaCreada.espacio_nombre =
      espacio.rows[0]?.nombre || "Espacio Deportivo";

    // 🔹 Generar PDF
    const archivoPDF = await generarPDFReserva(reservaCreada);

    // 🔹 Ruta física PDF
    const rutaPDF = path.join(__dirname, "../pdfs", archivoPDF);

    // 🔹 Enviar correo
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Comprobante de Reserva - UCB Deportes",

      text:
        `Su reserva fue registrada correctamente.\n\n` +
        `Fecha: ${fecha}\n` +
        `Hora Inicio: ${hora_inicio}\n` +
        `Hora Fin: ${hora_fin}`,

      attachments: [
        {
          filename: archivoPDF,
          path: rutaPDF,
        },
      ],
    });

    res.json({
      mensaje: "Reserva creada y correo enviado correctamente",
      reserva: reservaCreada,
      pdf: `http://localhost:3000/pdfs/${archivoPDF}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear reserva" });
  }
};

// 🔹 Listar reservas
const listarReservas = async (req, res) => {
  try {
    const { fecha } = req.query;

    let result;

    if (fecha) {
      result = await pool.query(
        "SELECT * FROM reservas WHERE fecha = $1 AND estado = 'activa'",
        [fecha],
      );
    } else {
      result = await pool.query(
        "SELECT * FROM reservas WHERE estado = 'activa'",
      );
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar reservas" });
  }
};

// 🔹 Cancelar reserva
const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE reservas
      SET estado = 'cancelada'
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json({ mensaje: "Reserva cancelada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cancelar reserva" });
  }
};

module.exports = {
  crearReserva,
  listarReservas,
  cancelarReserva,
};
