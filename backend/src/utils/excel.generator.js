const XLSX = require("xlsx");
const path = require("path");

// Generador genérico Excel
const generarExcel = (datos, nombreArchivo, nombreHoja) => {
  // Crear hoja
  const worksheet = XLSX.utils.json_to_sheet(datos);

  // Crear libro
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);

  // Ruta archivo
  const rutaArchivo = path.join(__dirname, "../excels", nombreArchivo);

  // Guardar
  XLSX.writeFile(workbook, rutaArchivo);

  return rutaArchivo;
};

module.exports = {
  generarExcel,
};
