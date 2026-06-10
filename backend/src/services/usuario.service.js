const { listarUsuariosDB } = require("../models/usuario.model");

const listarUsuarios = async () => {
  return await listarUsuariosDB();
};

module.exports = {
  listarUsuarios,
};
