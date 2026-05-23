const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    openapi: "3.0.0",
    info: {
      title: "API Sistema UCB",
      version: "1.0.0",
      description: "Documentación de la API - Grupo 3",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // lee tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
