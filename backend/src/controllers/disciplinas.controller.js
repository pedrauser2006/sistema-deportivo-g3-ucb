const disciplinaService = require("../services/disciplina.service");

// Crear disciplina
const crearDisciplina = async (req, res) => {
  try {
    const { nombre, descripcion, orden } = req.body;

    const disciplina = await disciplinaService.crearDisciplina(
      nombre,
      descripcion,
      orden,
    );

    res.json(disciplina);
  } catch (error) {
    console.error(error);

    if (error.message === "El nombre es obligatorio") {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.code === "23505") {
      return res.status(400).json({
        error: "La disciplina ya existe",
      });
    }

    res.status(500).json({
      error: "Error al crear disciplina",
    });
  }
};

// Listar disciplinas
const listarDisciplinas = async (req, res) => {
  try {
    const { activo } = req.query;

    const disciplinas = await disciplinaService.listarDisciplinas(activo);

    res.json(disciplinas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al listar disciplinas",
    });
  }
};

// Editar disciplina
const editarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, orden } = req.body;

    const disciplina = await disciplinaService.editarDisciplina(
      id,
      nombre,
      descripcion,
      orden,
    );

    res.json(disciplina);
  } catch (error) {
    console.error(error);

    if (error.message === "El nombre es obligatorio") {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.message === "Disciplina no encontrada") {
      return res.status(404).json({
        error: error.message,
      });
    }

    if (error.code === "23505") {
      return res.status(400).json({
        error: "La disciplina ya existe",
      });
    }

    res.status(500).json({
      error: "Error al editar disciplina",
    });
  }
};

// Eliminar disciplina
const eliminarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    await disciplinaService.eliminarDisciplina(id);

    res.json({
      mensaje: "Disciplina desactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Disciplina no encontrada") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al desactivar disciplina",
    });
  }
};

// Reactivar disciplina
const reactivarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    await disciplinaService.reactivarDisciplina(id);

    res.json({
      mensaje: "Disciplina reactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Disciplina no encontrada") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Error al reactivar disciplina",
    });
  }
};

module.exports = {
  crearDisciplina,
  listarDisciplinas,
  editarDisciplina,
  eliminarDisciplina,
  reactivarDisciplina,
};
