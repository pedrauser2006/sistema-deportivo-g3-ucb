const path = require("path");

const transporter = require("../utils/mailer");

const { generarPDFPago } = require("../utils/pdf.generator");

const {
  buscarDeportistaPorEmail,
  buscarConceptoPorId,
  crearPagoDB,
  guardarComprobantePago,
  listarPagosAdmin,
  listarPagosAdminPorDeportista,
  listarPagosEstudiante,
} = require("../models/pago.model");

// Crear pago

const crearPago = async (body, user) => {
  const { concepto_id, mes, anio, origen, observaciones } = body;

  const deportista = await buscarDeportistaPorEmail(user.email);

  if (!deportista) {
    throw new Error(
      "El usuario autenticado no está registrado como deportista",
    );
  }

  const concepto = await buscarConceptoPorId(concepto_id);

  if (!concepto) {
    throw new Error("Concepto de pago no encontrado");
  }

  const pago = await crearPagoDB([
    deportista.id,
    concepto_id,
    concepto.monto,
    mes,
    anio,
    origen,
    observaciones,
  ]);

  pago.deportista_nombre = deportista.nombre_completo;

  pago.concepto_nombre = concepto.nombre;

  const archivoPDF = await generarPDFPago(pago);

  await guardarComprobantePago(pago.id, archivoPDF);

  pago.comprobante = archivoPDF;

  const rutaPDF = path.join(__dirname, "../pdfs", archivoPDF);

  await transporter.sendMail({
    from: process.env.SMTP_USER,

    to: user.email,

    subject: "Comprobante de Pago - UCB Deportes",

    text:
      `Su pago fue registrado correctamente.\n\n` +
      `Concepto: ${concepto.nombre}\n` +
      `Monto: Bs ${concepto.monto}`,

    attachments: [
      {
        filename: archivoPDF,
        path: rutaPDF,
      },
    ],
  });

  return {
    mensaje: "Pago registrado y comprobante enviado",

    pdf: `http://localhost:3000/pdfs/${archivoPDF}`,
  };
};

// Listar pagos

const listarPagos = async (user, deportista_id) => {
  if (user.rol === "administrador") {
    if (deportista_id) {
      return await listarPagosAdminPorDeportista(deportista_id);
    }

    return await listarPagosAdmin();
  }

  const deportista = await buscarDeportistaPorEmail(user.email);

  if (!deportista) {
    throw new Error("No existe deportista asociado al usuario");
  }

  return await listarPagosEstudiante(deportista.id);
};

module.exports = {
  crearPago,
  listarPagos,
};
