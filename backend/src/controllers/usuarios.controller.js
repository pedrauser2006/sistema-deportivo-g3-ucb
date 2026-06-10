const usuarioService = require("../services/usuario.service");

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();

    res.json(usuarios);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al listar usuarios",
    });
  }
};

module.exports = {
  listarUsuarios,
};
