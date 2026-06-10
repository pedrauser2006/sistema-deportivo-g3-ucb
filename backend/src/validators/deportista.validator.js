const { body } = require("express-validator");

const validarCrearDeportista = [
  body("tipo").notEmpty().withMessage("El tipo es obligatorio"),

  body("nombre_completo").notEmpty().withMessage("El nombre es obligatorio"),

  body("ci").notEmpty().withMessage("El CI es obligatorio"),
];

module.exports = {
  validarCrearDeportista,
};
