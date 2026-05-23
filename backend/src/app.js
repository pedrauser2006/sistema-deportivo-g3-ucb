const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const app = express();

app.use(cors());
app.use(express.json());
const path = require("path");

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

module.exports = app;

const pool = require("./config/db");

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const usuariosRoutes = require("./routes/usuarios.routes");
app.use("/usuarios", usuariosRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const bcrypt = require("bcrypt");
app.get("/generar-hash", async (req, res) => {
  const hash = await bcrypt.hash("123456", 10);
  res.send(hash);
});

const reservasRoutes = require("./routes/reservas.routes");
app.use("/reservas", reservasRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const disciplinasRoutes = require("./routes/disciplinas.routes");
app.use("/disciplinas", disciplinasRoutes);

const deportistasRoutes = require("./routes/deportistas.routes");
app.use("/deportistas", deportistasRoutes);

const pagosRoutes = require("./routes/pagos.routes");
app.use("/pagos", pagosRoutes);

const exportRoutes = require("./routes/export.routes");
app.use("/export", exportRoutes);

const transporter = require("./utils/mailer");

app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Prueba SMTP UCB Deportes",
      text: "Correo de prueba enviado correctamente 🚀",
    });

    res.json({
      mensaje: "Correo enviado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al enviar correo",
    });
  }
});
