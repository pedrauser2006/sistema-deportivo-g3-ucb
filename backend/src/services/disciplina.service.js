const {
  crearDisciplinaDB,
  listarDisciplinasDB,
  editarDisciplinaDB,
  desactivarDisciplinaDB,
  reactivarDisciplinaDB,
} = require("../models/disciplina.model");

const crearDisciplina = async (nombre, descripcion, orden) => {
  if (!nombre) {
    throw new Error("El nombre es obligatorio");
  }

  return await crearDisciplinaDB(nombre, descripcion || null, orden || 0);
};

const listarDisciplinas = async (activo) => {
  let query = `
    SELECT *
    FROM disciplinas
  `;

  const condiciones = [];

  if (activo === "true") {
    condiciones.push("activo = TRUE");
  }

  if (activo === "false") {
    condiciones.push("activo = FALSE");
  }

  if (condiciones.length > 0) {
    query += ` WHERE ` + condiciones.join(" AND ");
  }

  query += `
    ORDER BY orden ASC,
    nombre ASC
  `;

  return await listarDisciplinasDB(query);
};

const editarDisciplina = async (id, nombre, descripcion, orden) => {
  if (!nombre) {
    throw new Error("El nombre es obligatorio");
  }

  const disciplina = await editarDisciplinaDB(
    id,
    nombre,
    descripcion || null,
    orden || 0,
  );

  if (!disciplina) {
    throw new Error("Disciplina no encontrada");
  }

  return disciplina;
};

const eliminarDisciplina = async (id) => {
  const disciplina = await desactivarDisciplinaDB(id);

  if (!disciplina) {
    throw new Error("Disciplina no encontrada");
  }

  return disciplina;
};

const reactivarDisciplina = async (id) => {
  const disciplina = await reactivarDisciplinaDB(id);

  if (!disciplina) {
    throw new Error("Disciplina no encontrada");
  }

  return disciplina;
};

module.exports = {
  crearDisciplina,
  listarDisciplinas,
  editarDisciplina,
  eliminarDisciplina,
  reactivarDisciplina,
};
