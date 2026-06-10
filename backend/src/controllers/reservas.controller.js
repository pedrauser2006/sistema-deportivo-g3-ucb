const reservaService = require("../services/reserva.service");

// Crear reserva

const crearReserva = async (req, res) => {
  try {
    const resultado = await reservaService.crearReserva(req.body, req.user);

    res.json(resultado);
  } catch (error) {
    console.error(error);

    if (
      error.message ===
      "El usuario autenticado no está registrado como deportista"
    ) {
      return res.status(403).json({
        error: error.message,
      });
    }

    if (error.message === "El horario ya está ocupado") {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al crear reserva",
    });
  }
};

// Listar reservas

const listarReservas = async (req, res) => {
  try {
    const reservas = await reservaService.listarReservas(
      req.user,
      req.query.fecha,
    );

    res.json(reservas);
  } catch (error) {
    console.error(error);

    if (error.message === "No existe deportista asociado al usuario") {
      return res.status(403).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al listar reservas",
    });
  }
};

// Cancelar reserva

const cancelarReserva = async (req, res) => {
  try {
    await reservaService.cancelarReserva(req.params.id, req.user);

    res.json({
      mensaje: "Reserva cancelada",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Reserva no encontrada") {
      return res.status(404).json({
        error: error.message,
      });
    }

    if (error.message === "No puede cancelar esta reserva") {
      return res.status(403).json({
        error: error.message,
      });
    }

    if (error.message === "No existe deportista asociado al usuario") {
      return res.status(403).json({
        error: error.message,
      });
    }

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
