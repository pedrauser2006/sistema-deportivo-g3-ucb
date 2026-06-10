const {
  crearDeportistaDB,
  listarDeportistasDB,
  editarDeportistaDB,
  desactivarDeportistaDB,
  reactivarDeportistaDB,
  reactivarMatriculaDB,
  desactivarMatriculaDB,
} = require("../models/deportista.model");

// Crear

const crearDeportista = async (data) => {
  const {
    tipo,
    nombre_completo,
    ci,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
    carrera,
    semestre,
    talla_camiseta,
  } = data;

  if (!tipo || !nombre_completo || !ci) {
    throw new Error("Faltan datos obligatorios");
  }

  const tiposPermitidos = ["estudiante_ucb", "externo"];

  if (!tiposPermitidos.includes(tipo)) {
    throw new Error("Tipo de deportista inválido");
  }

  if (tipo === "estudiante_ucb" && (!carrera || !semestre)) {
    throw new Error("Para estudiantes UCB debe registrar carrera y semestre");
  }

  return await crearDeportistaDB([
    tipo,
    nombre_completo,
    ci,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
    carrera,
    semestre,
    tipo === "estudiante_ucb",
    tipo === "estudiante_ucb" ? new Date() : null,
    talla_camiseta,
  ]);
};

// Listar

const listarDeportistas = async (activo, tipo) => {
  let query = `
    SELECT *
    FROM deportistas
  `;

  const condiciones = [];
  const params = [];

  if (activo === "true") {
    condiciones.push("activo = TRUE");
  }

  if (activo === "false") {
    condiciones.push("activo = FALSE");
  }

  if (tipo) {
    params.push(tipo);
    condiciones.push(`tipo = $${params.length}`);
  }

  if (condiciones.length > 0) {
    query += " WHERE " + condiciones.join(" AND ");
  }

  query += " ORDER BY id ASC";

  return await listarDeportistasDB(query, params);
};

// Editar

const editarDeportista = async (id, data) => {
  const {
    nombre_completo,
    ci,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
    carrera,
    semestre,
    talla_camiseta,
  } = data;

  if (!nombre_completo || !ci) {
    throw new Error("Datos incompletos");
  }

  const deportista = await editarDeportistaDB([
    nombre_completo,
    ci,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
    carrera,
    semestre,
    talla_camiseta,
    id,
  ]);

  if (!deportista) {
    throw new Error("Deportista no encontrado");
  }

  return deportista;
};

// Eliminar

const eliminarDeportista = async (id) => {
  const deportista = await desactivarDeportistaDB(id);

  if (!deportista) {
    throw new Error("Deportista no encontrado");
  }

  return deportista;
};

// Reactivar

const reactivarDeportista = async (id) => {
  const deportista = await reactivarDeportistaDB(id);

  if (!deportista) {
    throw new Error("Deportista no encontrado");
  }

  return deportista;
};

// Reactivar matrícula

const reactivarMatricula = async (id) => {
  const deportista = await reactivarMatriculaDB(id);

  if (!deportista) {
    throw new Error("Deportista no encontrado");
  }

  return deportista;
};

// Desactivar matrícula

const desactivarMatricula = async (id) => {
  const deportista = await desactivarMatriculaDB(id);

  if (!deportista) {
    throw new Error("Deportista no encontrado");
  }

  return deportista;
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
