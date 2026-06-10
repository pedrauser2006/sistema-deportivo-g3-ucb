const { body } = require("express-validator");

const validarCrearPago = [
  body("concepto_id").notEmpty().withMessage("Concepto obligatorio"),

  body("mes").notEmpty().withMessage("Mes obligatorio"),

  body("anio").notEmpty().withMessage("Año obligatorio"),
];

module.exports = {
  validarCrearPago,
};
