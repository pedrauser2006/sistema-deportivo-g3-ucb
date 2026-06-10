const path = require("path");

const transporter = require("../utils/mailer");
const { generarPDFReserva } = require("../utils/pdf.generator");

const {
  buscarDeportistaPorEmail,
  verificarHorarioOcupado,
  crearReservaDB,
  obtenerEspacioPorId,
  guardarPDFReserva,
  listarReservasAdmin,
  listarReservasAdminPorFecha,
  listarReservasEstudiante,
  listarReservasEstudiantePorFecha,
  cancelarReservaAdmin,
  cancelarReservaEstudiante,
} = require("../models/reserva.model");

// Crear reserva

const crearReserva = async (body, user) => {
  const { espacio_id, disciplina_id, fecha, hora_inicio, hora_fin, motivo } =
    body;

  const deportista = await buscarDeportistaPorEmail(user.email);

  if (!deportista) {
    throw new Error(
      "El usuario autenticado no está registrado como deportista",
    );
  }

  const ocupado = await verificarHorarioOcupado(
    espacio_id,
    fecha,
    hora_inicio,
    hora_fin,
  );

  if (ocupado.length > 0) {
    throw new Error("El horario ya está ocupado");
  }

  const reserva = await crearReservaDB([
    espacio_id,
    user.id,
    deportista.id,
    disciplina_id,
    fecha,
    hora_inicio,
    hora_fin,
    motivo,
  ]);

  const espacio = await obtenerEspacioPorId(reserva.espacio_id);

  reserva.espacio_nombre = espacio?.nombre || "Espacio Deportivo";

  const archivoPDF = await generarPDFReserva(reserva);

  await guardarPDFReserva(reserva.id, archivoPDF);

  reserva.comprobante_pdf = archivoPDF;

  const rutaPDF = path.join(__dirname, "../pdfs", archivoPDF);

  await transporter.sendMail({
    from: process.env.SMTP_USER,

    to: user.email,

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

  return {
    mensaje: "Reserva creada y correo enviado correctamente",

    reserva,

    pdf: `http://localhost:3000/pdfs/${archivoPDF}`,
  };
};

// Listar reservas

const listarReservas = async (user, fecha) => {
  if (user.rol === "administrador") {
    if (fecha) {
      return await listarReservasAdminPorFecha(fecha);
    }

    return await listarReservasAdmin();
  }

  const deportista = await buscarDeportistaPorEmail(user.email);

  if (!deportista) {
    throw new Error("No existe deportista asociado al usuario");
  }

  if (fecha) {
    return await listarReservasEstudiantePorFecha(deportista.id, fecha);
  }

  return await listarReservasEstudiante(deportista.id);
};

// Cancelar reserva

const cancelarReserva = async (id, user) => {
  if (user.rol === "administrador") {
    const reserva = await cancelarReservaAdmin(id);

    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    return reserva;
  }

  const deportista = await buscarDeportistaPorEmail(user.email);

  if (!deportista) {
    throw new Error("No existe deportista asociado al usuario");
  }

  const reserva = await cancelarReservaEstudiante(id, deportista.id);

  if (!reserva) {
    throw new Error("No puede cancelar esta reserva");
  }

  return reserva;
};

module.exports = {
  crearReserva,
  listarReservas,
  cancelarReserva,
};
