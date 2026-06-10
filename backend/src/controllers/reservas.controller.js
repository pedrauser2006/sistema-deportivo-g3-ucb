const pool = require("../config/db");
const path = require("path");
const transporter = require("../utils/mailer");
const { generarPDFReserva } = require("../utils/pdf.generator");

// Crear reserva
const crearReserva = async (req, res) => {
  try {
    const { espacio_id, disciplina_id, fecha, hora_inicio, hora_fin, motivo } =
      req.body;

    const emailUsuario = req.user.email;
    const solicitanteId = req.user.id;

    // Buscar deportista asociado al usuario logueado
    const deportista = await pool.query(
      `
      SELECT id
      FROM deportistas
      WHERE email = $1
      AND activo = true
      `,
      [emailUsuario],
    );

    if (deportista.rows.length === 0) {
      return res.status(403).json({
        error: "El usuario autenticado no está registrado como deportista",
      });
    }

    const deportistaId = deportista.rows[0].id;

    // Validar horario ocupado
    const existe = await pool.query(
      `
      SELECT *
      FROM reservas
      WHERE espacio_id = $1
      AND fecha = $2
      AND estado = 'confirmada'
      AND (
        hora_inicio < $4
        AND hora_fin > $3
      )
      `,
      [espacio_id, fecha, hora_inicio, hora_fin],
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: "El horario ya está ocupado",
      });
    }

    // Crear reserva
    const nueva = await pool.query(
      `
      INSERT INTO reservas (
        espacio_id,
        solicitante_id,
        deportista_id,
        disciplina_id,
        fecha,
        hora_inicio,
        hora_fin,
        motivo,
        estado
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        'confirmada'
      )
      RETURNING *
      `,
      [
        espacio_id,
        solicitanteId,
        deportistaId,
        disciplina_id,
        fecha,
        hora_inicio,
        hora_fin,
        motivo,
      ],
    );

    const reservaCreada = nueva.rows[0];

    // Obtener nombre del espacio
    const espacio = await pool.query(
      "SELECT nombre FROM espacios WHERE id = $1",
      [reservaCreada.espacio_id],
    );

    reservaCreada.espacio_nombre =
      espacio.rows[0]?.nombre || "Espacio Deportivo";

    // Generar PDF
    const archivoPDF = await generarPDFReserva(reservaCreada);

    await pool.query(
      `
      UPDATE reservas
      SET comprobante_pdf = $1
      WHERE id = $2
      `,
      [archivoPDF, reservaCreada.id],
    );

    reservaCreada.comprobante_pdf = archivoPDF;

    // Ruta física PDF
    const rutaPDF = path.join(__dirname, "../pdfs", archivoPDF);

    // Enviar correo
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: req.user.email,
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
    res.status(500).json({
      error: "Error al crear reserva",
    });
  }
};

// Listar reservas
const listarReservas = async (req, res) => {
  try {
    const { fecha } = req.query;

    let result;

    // ADMINISTRADOR → ve todas
    if (req.user.rol === "administrador") {
      if (fecha) {
        result = await pool.query(
          `
          SELECT *
          FROM reservas
          WHERE fecha = $1
          AND estado = 'confirmada'
          `,
          [fecha],
        );
      } else {
        result = await pool.query(
          `
          SELECT *
          FROM reservas
          WHERE estado = 'confirmada'
          `,
        );
      }
    }

    // ESTUDIANTE → solo sus reservas
    else {
      const deportista = await pool.query(
        `
        SELECT id
        FROM deportistas
        WHERE email = $1
        `,
        [req.user.email],
      );

      if (deportista.rows.length === 0) {
        return res.status(403).json({
          error: "No existe deportista asociado al usuario",
        });
      }

      const deportistaId = deportista.rows[0].id;

      if (fecha) {
        result = await pool.query(
          `
          SELECT *
          FROM reservas
          WHERE deportista_id = $1
          AND fecha = $2
          AND estado = 'confirmada'
          `,
          [deportistaId, fecha],
        );
      } else {
        result = await pool.query(
          `
          SELECT *
          FROM reservas
          WHERE deportista_id = $1
          AND estado = 'confirmada'
          `,
          [deportistaId],
        );
      }
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al listar reservas",
    });
  }
};

// Cancelar reserva
const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    // ADMINISTRADOR
    if (req.user.rol === "administrador") {
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
        return res.status(404).json({
          error: "Reserva no encontrada",
        });
      }

      return res.json({
        mensaje: "Reserva cancelada",
      });
    }

    // ESTUDIANTE
    const deportista = await pool.query(
      `
      SELECT id
      FROM deportistas
      WHERE email = $1
      `,
      [req.user.email],
    );

    if (deportista.rows.length === 0) {
      return res.status(403).json({
        error: "No existe deportista asociado al usuario",
      });
    }

    const deportistaId = deportista.rows[0].id;

    const result = await pool.query(
      `
      UPDATE reservas
      SET estado = 'cancelada'
      WHERE id = $1
      AND deportista_id = $2
      RETURNING *
      `,
      [id, deportistaId],
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        error: "No puede cancelar esta reserva",
      });
    }

    res.json({
      mensaje: "Reserva cancelada",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al cancelar reserva",
    });
  }
};

module.exports = {
  crearReserva,
  listarReservas,
  cancelarReserva,
};
