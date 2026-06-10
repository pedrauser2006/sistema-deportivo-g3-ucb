const pool = require("../config/db");
const path = require("path");
const transporter = require("../utils/mailer");
const { generarPDFPago } = require("../utils/pdf.generator");

// Crear pago
const crearPago = async (req, res) => {
  try {
    const { concepto_id, mes, anio, origen, observaciones } = req.body;

    // Usuario logueado
    const emailUsuario = req.user.email;

    // Buscar deportista
    const deportista = await pool.query(
      `
      SELECT *
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

    const deportistaData = deportista.rows[0];

    // Buscar concepto
    const concepto = await pool.query(
      `
      SELECT *
      FROM conceptos_pago
      WHERE id = $1
      AND activo = true
      `,
      [concepto_id],
    );

    if (concepto.rows.length === 0) {
      return res.status(404).json({
        error: "Concepto de pago no encontrado",
      });
    }

    const conceptoData = concepto.rows[0];

    // Crear pago
    const nuevoPago = await pool.query(
      `
      INSERT INTO pagos (
        deportista_id,
        concepto_id,
        monto,
        mes,
        anio,
        fecha_pago,
        origen,
        estado,
        observaciones
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        CURRENT_DATE,
        $6,
        'confirmado',
        $7
      )
      RETURNING *
      `,
      [
        deportistaData.id,
        concepto_id,
        conceptoData.monto,
        mes,
        anio,
        origen,
        observaciones,
      ],
    );

    const pago = nuevoPago.rows[0];

    // Datos para PDF
    pago.deportista_nombre = deportistaData.nombre_completo;

    pago.concepto_nombre = conceptoData.nombre;

    // Generar PDF
    const archivoPDF = await generarPDFPago(pago);

    // Guardar comprobante
    await pool.query(
      `
      UPDATE pagos
      SET comprobante = $1
      WHERE id = $2
      `,
      [archivoPDF, pago.id],
    );

    pago.comprobante = archivoPDF;

    // Ruta PDF
    const rutaPDF = path.join(__dirname, "../pdfs", archivoPDF);

    // Enviar correo
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: req.user.email,
      subject: "Comprobante de Pago - UCB Deportes",

      text:
        `Su pago fue registrado correctamente.\n\n` +
        `Concepto: ${conceptoData.nombre}\n` +
        `Monto: Bs ${conceptoData.monto}`,

      attachments: [
        {
          filename: archivoPDF,
          path: rutaPDF,
        },
      ],
    });

    res.json({
      mensaje: "Pago registrado y comprobante enviado",
      pago,
      pdf: `http://localhost:3000/pdfs/${archivoPDF}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al registrar pago",
    });
  }
};

// Listar todos los pagos
const listarPagos = async (req, res) => {
  try {
    let result;

    // Administrador ve todo
    if (req.user.rol === "administrador") {
      const { deportista_id } = req.query;

      if (deportista_id) {
        result = await pool.query(
          `
          SELECT p.*, d.nombre_completo
          FROM pagos p
          JOIN deportistas d
            ON p.deportista_id = d.id
          WHERE p.deportista_id = $1
          `,
          [deportista_id],
        );
      } else {
        result = await pool.query(
          `
          SELECT p.*, d.nombre_completo
          FROM pagos p
          JOIN deportistas d
            ON p.deportista_id = d.id
          `,
        );
      }
    }

    // Estudiante solo los suyos
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

      result = await pool.query(
        `
        SELECT *
        FROM pagos
        WHERE deportista_id = $1
        `,
        [deportista.rows[0].id],
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al listar pagos",
    });
  }
};

module.exports = {
  crearPago,
  listarPagos,
};
