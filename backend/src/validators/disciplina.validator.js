const { body } = require("express-validator");

const validarCrearDisciplina = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
];

module.exports = {
  validarCrearDisciplina,
};
