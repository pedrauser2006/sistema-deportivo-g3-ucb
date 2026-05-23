const verificarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (req.user.rol !== rolPermitido) {
      return res.status(403).json({ error: "No autorizado" });
    }

    next();
  };
};

module.exports = { verificarRol };
