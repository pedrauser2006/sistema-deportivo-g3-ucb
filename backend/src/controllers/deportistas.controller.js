const pool = require("../config/db");

// Crear deportista

const crearDeportista = async (req, res) => {
  try {
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
    } = req.body;

    if (!tipo || !nombre_completo || !ci) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
      });
    }

    const tiposPermitidos = ["estudiante_ucb", "externo"];

    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        error: "Tipo de deportista inválido",
      });
    }

    if (tipo === "estudiante_ucb") {
      if (!carrera || !semestre) {
        return res.status(400).json({
          error: "Para estudiantes UCB debe registrar carrera y semestre",
        });
      }
    }

    // Insertar
    const result = await pool.query(
      `INSERT INTO deportistas (
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
        matricula_activa,
        ultima_validacion_matricula,
        talla_camiseta
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING *
      `,

      [
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
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "El CI ya está registrado",
      });
    }

    res.status(500).json({ error: "Error al crear deportista" });
  }
};

// Listar deportistas

const listarDeportistas = async (req, res) => {
  try {
    const { activo, tipo } = req.query;

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
      query += ` WHERE ` + condiciones.join(" AND ");
    }

    query += ` ORDER BY id ASC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
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
    } = req.body;

    // VALIDAR DATOS
    if (!nombre_completo || !ci) {
      return res.status(400).json({
        error: "Datos incompletos",
      });
    }

    const result = await pool.query(
      `
      UPDATE deportistas
      SET
        nombre_completo = $1,
        ci = $2,
        fecha_nacimiento = $3,
        genero = $4,
        telefono = $5,
        email = $6,
        direccion = $7,
        carrera = $8,
        semestre = $9,
        talla_camiseta = $10
      WHERE id = $11
      RETURNING *
      `,
      [
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
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deportista no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "El CI ya está registrado",
      });
    }

    res.status(500).json({ error: "Error al editar deportista" });
  }
};

// Eliminar deportista

const eliminarDeportista = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE deportistas
      SET activo = FALSE
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deportista no encontrado" });
    }

    res.json({
      mensaje: "Deportista desactivado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al desactivar deportista",
    });
  }
};

// Reactivar Deportista

const reactivarDeportista = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE deportistas
      SET activo = TRUE
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Deportista no encontrado",
      });
    }

    res.json({
      mensaje: "Deportista reactivado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar deportista",
    });
  }
};

// Reactivar Matrícula

const reactivarMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE deportistas
      SET
        matricula_activa = TRUE,
        ultima_validacion_matricula = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Deportista no encontrado",
      });
    }

    res.json({
      mensaje: "Matrícula reactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar matrícula",
    });
  }
};

// Desactivar Matrícula

const desactivarMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE deportistas
      SET matricula_activa = FALSE
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Deportista no encontrado",
      });
    }

    res.json({
      mensaje: "Matrícula desactivada correctamente",
    });
  } catch (error) {
    console.error(error);

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
