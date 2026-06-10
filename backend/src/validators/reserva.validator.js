const { body } = require("express-validator");

const validarCrearReserva = [
  body("espacio_id").notEmpty().withMessage("Espacio obligatorio"),

  body("disciplina_id").notEmpty().withMessage("Disciplina obligatoria"),

  body("fecha").notEmpty().withMessage("Fecha obligatoria"),

  body("hora_inicio").notEmpty().withMessage("Hora inicio obligatoria"),

  body("hora_fin").notEmpty().withMessage("Hora fin obligatoria"),
];

module.exports = {
  validarCrearReserva,
};
