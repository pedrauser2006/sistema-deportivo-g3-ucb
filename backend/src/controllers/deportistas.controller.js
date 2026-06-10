const deportistaService = require("../services/deportista.service");

// Crear deportista

const crearDeportista = async (req, res) => {
  try {
    const deportista = await deportistaService.crearDeportista(req.body);

    res.json(deportista);
  } catch (error) {
    console.error(error);

    if (
      error.message === "Faltan datos obligatorios" ||
      error.message === "Tipo de deportista inválido" ||
      error.message === "Para estudiantes UCB debe registrar carrera y semestre"
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.code === "23505") {
      return res.status(400).json({
        error: "El CI ya está registrado",
      });
    }

    res.status(500).json({
      error: "Error al crear deportista",
    });
  }
};

// Listar deportistas

const listarDeportistas = async (req, res) => {
  try {
    const { activo, tipo } = req.query;

    const deportistas = await deportistaService.listarDeportistas(activo, tipo);

    res.json(deportistas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al listar deportistas",
    });
  }
};

// Editar deportista

const editarDeportista = async (req, res) => {
  try {
    const { id } = req.params;

    const deportista = await deportistaService.editarDeportista(id, req.body);

    res.json(deportista);
  } catch (error) {
    console.error(error);

    if (error.message === "Datos incompletos") {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.message === "Deportista no encontrado") {
      return res.status(404).json({
        error: error.message,
      });
    }

    if (error.code === "23505") {
      return res.status(400).json({
        error: "El CI ya está registrado",
      });
    }

    res.status(500).json({
      error: "Error al editar deportista",
    });
  }
};

// Eliminar deportista

const eliminarDeportista = async (req, res) => {
  try {
    const { id } = req.params;

    await deportistaService.eliminarDeportista(id);

    res.json({
      mensaje: "Deportista desactivado correctamente",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Deportista no encontrado") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al desactivar deportista",
    });
  }
};

// Reactivar deportista

const reactivarDeportista = async (req, res) => {
  try {
    const { id } = req.params;

    await deportistaService.reactivarDeportista(id);

    res.json({
      mensaje: "Deportista reactivado correctamente",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Deportista no encontrado") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al reactivar deportista",
    });
  }
};

// Reactivar matrícula

const reactivarMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    await deportistaService.reactivarMatricula(id);

    res.json({
      mensaje: "Matrícula reactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Deportista no encontrado") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al reactivar matrícula",
    });
  }
};

// Desactivar matrícula

const desactivarMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    await deportistaService.desactivarMatricula(id);

    res.json({
      mensaje: "Matrícula desactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Deportista no encontrado") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al desactivar matrícula",
    });
  }
};

module.exports = {
  crearDeportista,
  listarDeportistas,
  editarDeportista,
  eliminarDeportista,
  reactivarDeportista,
  reactivarMatricula,
  desactivarMatricula,
};
