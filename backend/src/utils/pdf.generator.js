const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generarPDFReserva = (reserva) => {
  return new Promise((resolve, reject) => {
    try {
      const nombreArchivo = `reserva_${reserva.id}.pdf`;

      const rutaPDF = path.join(__dirname, "../pdfs", nombreArchivo);

      const doc = new PDFDocument({
        margin: 50,
      });

      const stream = fs.createWriteStream(rutaPDF);

      doc.pipe(stream);

      // COLORES
      const azul = "#003b70";
      const naranja = "#f39c12";

      // HEADER
      doc.rect(0, 0, doc.page.width, 80).fill(azul);

      doc
        .fillColor("white")
        .fontSize(22)
        .text("UNIVERSIDAD CATÓLICA BOLIVIANA", 50, 25, {
          align: "center",
        });

      // SUBTÍTULO
      doc
        .moveDown(3)
        .fillColor("black")
        .fontSize(18)
        .text("COMPROBANTE DE RESERVA", {
          align: "center",
        });

      doc.moveDown(2);

      // CAJA INFORMACIÓN
      doc
        .roundedRect(70, 180, 450, 180, 10)
        .lineWidth(2)
        .strokeColor(naranja)
        .stroke();

      // DATOS
      doc.fontSize(13).fillColor("black");

      let y = 210;

      doc.text(`Código de Reserva: ${reserva.id}`, 100, y);
      y += 30;

      doc.text(`Espacio Deportivo: ${reserva.espacio_nombre}`, 100, y);
      y += 30;

      doc.text(
        `Fecha: ${new Date(reserva.fecha).toLocaleDateString()}`,
        100,
        y,
      );
      y += 30;

      doc.text(`Hora Inicio: ${reserva.hora_inicio}`, 100, y);
      y += 30;

      doc.text(`Hora Fin: ${reserva.hora_fin}`, 100, y);

      // FOOTER
      doc
        .fontSize(11)
        .fillColor("gray")
        .text(
          "Sistema Deportivo UCB - Documento generado automáticamente",
          50,
          700,
          {
            align: "center",
          },
        );

      doc.end();

      stream.on("finish", () => {
        resolve(nombreArchivo);
      });

      stream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const generarPDFPago = (pago) => {
  return new Promise((resolve, reject) => {
    try {
      const nombreArchivo = `pago_${pago.id}.pdf`;

      const rutaPDF = path.join(__dirname, "../pdfs", nombreArchivo);

      const doc = new PDFDocument({
        margin: 50,
      });

      const stream = fs.createWriteStream(rutaPDF);

      doc.pipe(stream);

      const azul = "#003b70";
      const verde = "#16a34a";

      // Header
      doc.rect(0, 0, doc.page.width, 80).fill(azul);

      doc
        .fillColor("white")
        .fontSize(22)
        .text("UNIVERSIDAD CATÓLICA BOLIVIANA", 50, 25, {
          align: "center",
        });

      // Título
      doc
        .moveDown(3)
        .fillColor("black")
        .fontSize(18)
        .text("COMPROBANTE DE PAGO", {
          align: "center",
        });

      doc.moveDown(2);

      // Caja
      doc
        .roundedRect(70, 180, 450, 220, 10)
        .lineWidth(2)
        .strokeColor(verde)
        .stroke();

      let y = 210;

      doc.fontSize(13).fillColor("black");

      doc.text(`Código de Pago: ${pago.id}`, 100, y);
      y += 30;

      doc.text(`Deportista: ${pago.deportista_nombre}`, 100, y);
      y += 30;

      doc.text(`Concepto: ${pago.concepto_nombre}`, 100, y);
      y += 30;

      doc.text(`Monto: Bs ${pago.monto}`, 100, y);
      y += 30;

      doc.text(`Mes: ${pago.mes}`, 100, y);
      y += 30;

      doc.text(`Año: ${pago.anio}`, 100, y);
      y += 30;

      doc.text(
        `Fecha de Pago: ${new Date(pago.fecha_pago).toLocaleDateString()}`,
        100,
        y,
      );

      // Footer
      doc
        .fontSize(11)
        .fillColor("gray")
        .text(
          "Sistema Deportivo UCB - Documento generado automáticamente",
          50,
          700,
          {
            align: "center",
          },
        );

      doc.end();

      stream.on("finish", () => {
        resolve(nombreArchivo);
      });

      stream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Generador PDF Reportes
const generarPDFReporte = (titulo, columnas, datos, nombreArchivo) => {
  return new Promise((resolve, reject) => {
    try {
      const rutaPDF = path.join(__dirname, "../pdfs", nombreArchivo);

      const doc = new PDFDocument({
        margin: 40,
      });

      const stream = fs.createWriteStream(rutaPDF);

      doc.pipe(stream);

      // Colores
      const azul = "#003b70";

      // Header
      doc.rect(0, 0, doc.page.width, 70).fill(azul);

      doc
        .fillColor("white")
        .fontSize(20)
        .text("UNIVERSIDAD CATÓLICA BOLIVIANA", 40, 25, {
          align: "center",
        });

      // Título
      doc.moveDown(3).fillColor("black").fontSize(18).text(titulo, {
        align: "center",
      });

      doc.moveDown(2);

      // Tabla
      let y = 140;

      // Posiciones columnas
      const posiciones = [50, 140, 260, 360, 450];

      // Header tabla
      doc.rect(40, y, 520, 25).fill("#003b70");

      doc.fontSize(11).fillColor("white");

      // Dibujar headers
      columnas.forEach((col, index) => {
        doc.text(col.header, posiciones[index], y + 7);
      });

      y += 35;

      // Filas
      datos.forEach((item) => {
        doc
          .strokeColor("#d1d5db")
          .lineWidth(0.5)
          .moveTo(40, y + 20)
          .lineTo(560, y + 20)
          .stroke();

        doc.fontSize(10).fillColor("black");

        columnas.forEach((col, index) => {
          let valor = item[col.key];

          // Fechas
          if (col.key.includes("fecha") && valor) {
            valor = new Date(valor).toLocaleDateString();
          }

          doc.text(String(valor || "-"), posiciones[index], y, {
            width: 90,
          });
        });

        y += 28;

        // Nueva página
        if (y > 720) {
          doc.addPage();

          y = 50;
        }
      });

      /*// Footer dinámico
      const footerY = doc.page.height - 40;

      doc
        .fontSize(9)
        .fillColor("gray")
        .text("Sistema Deportivo UCB", 0, footerY, {
          align: "center",
        });*/

      doc.end();

      stream.on("finish", () => {
        resolve(rutaPDF);
      });

      stream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generarPDFReserva,
  generarPDFPago,
  generarPDFReporte,
};
