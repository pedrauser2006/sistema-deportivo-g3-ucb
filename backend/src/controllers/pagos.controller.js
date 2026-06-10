const pagoService = require("../services/pago.service");

// Crear pago

const crearPago = async (req, res) => {
  try {
    const resultado = await pagoService.crearPago(req.body, req.user);

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

    if (error.message === "Concepto de pago no encontrado") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al registrar pago",
    });
  }
};

// Listar pagos

const listarPagos = async (req, res) => {
  try {
    const pagos = await pagoService.listarPagos(
      req.user,
      req.query.deportista_id,
    );

    res.json(pagos);
  } catch (error) {
    console.error(error);

    if (error.message === "No existe deportista asociado al usuario") {
      return res.status(403).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al listar pagos",
    });
  }
};

module.exports = {
  crearPago,
  listarPagos,
};
