import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getReservas,
  crearReserva,
  cancelarReserva,
} from "../services/reservas.service";
import "../styles/reservas.css";
import Loader from "../components/Loader";

export default function Reservas() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    espacio_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    email: "",
  });

  // 🔹 cargar datos
  const cargarDatos = async () => {
    try {
      const data = await getReservas();
      setReservas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    const modal = searchParams.get("modal");

    if (modal === "crear") {
      setModalOpen(true);
    }
  }, [searchParams]);

  // 🔹 manejar inputs
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 crear reserva
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setModalOpen(false);

    Swal.fire({
      title: "Creando reserva...",
      allowOutsideClick: false,
      allowEscapeKey: false,

      didOpen: () => {
        Swal.showLoading();
      },

      background: document.body.classList.contains("dark")
        ? "#1e293b"
        : "#ffffff",

      color: document.body.classList.contains("dark") ? "#f8fafc" : "#1f2937",
    });

    try {
      const response = await crearReserva({
        ...form,
        espacio_id: Number(form.espacio_id),
      });

      const result = await Swal.fire({
        title: "Reserva creada correctamente",

        html: `
    <p>📧 El comprobante fue enviado al correo.</p>
    <p>📄 El PDF fue generado automáticamente.</p>
  `,

        icon: "success",

        confirmButtonText: "Descargar PDF",
        cancelButtonText: "Cerrar",

        showCancelButton: true,

        confirmButtonColor: "#003b70",
        cancelButtonColor: "#64748b",

        background: document.body.classList.contains("dark")
          ? "#1e293b"
          : "#ffffff",

        color: document.body.classList.contains("dark") ? "#f8fafc" : "#1f2937",
      });

      if (result.isConfirmed) {
        window.open(response.pdf, "_blank");
      }
      setForm({
        espacio_id: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        email: "",
      });

      setModalOpen(false);

      cargarDatos();
    } catch (error: any) {
      Swal.close();
      toast.error(error.message);
    }
  };

  // 🔹 cancelar
  const handleCancelar = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",

      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#003b70",

      background: document.body.classList.contains("dark")
        ? "#1e293b"
        : "#ffffff",

      color: document.body.classList.contains("dark") ? "#f8fafc" : "#1f2937",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelarReserva(id);

      toast.success("Reserva cancelada");

      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="reservas-page">
      <div className="page-header">
        <h2 className="page-title">Reservas</h2>

        <p className="page-description">
          Gestiona reservas deportivas del sistema.
        </p>
      </div>

      {/* FORM 
      <div className="form-card">
        <form onSubmit={handleSubmit} className="reservas-form">
          <input
            name="espacio_id"
            placeholder="Espacio ID"
            value={form.espacio_id}
            onChange={handleChange}
          />

          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
          />

          <input
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
          />

          <input
            type="time"
            name="hora_fin"
            value={form.hora_fin}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary">
            Crear Reserva
          </button>
        </form>
      </div>
      */}

      <div className="page-actions">
        <button
          className="btn-primary"
          onClick={() => {
            setForm({
              espacio_id: "",
              fecha: "",
              hora_inicio: "",
              hora_fin: "",
              email: "",
            });

            setModalOpen(true);
          }}
        >
          Nueva Reserva
        </button>

        <button
          className="btn-export"
          onClick={() => {
            window.open(
              "http://localhost:3000/export/reservas/excel",
              "_blank",
            );
          }}
        >
          📊 Exportar Excel
        </button>

        <button
          className="btn-export pdf"
          onClick={() => {
            window.open("http://localhost:3000/export/reservas/pdf", "_blank");
          }}
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* TABLA */}
      <div className="table-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Espacio</th>
                <th>Fecha</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>

                  <td>{r.espacio_id}</td>

                  <td>{new Date(r.fecha).toLocaleDateString()}</td>

                  <td>{r.hora_inicio}</td>

                  <td>{r.hora_fin}</td>

                  <td>
                    <span className="status active">Activa</span>
                  </td>

                  <td>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelar(r.id)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nueva Reserva</h3>

              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="espacio_id"
                placeholder="Espacio ID"
                value={form.espacio_id}
                onChange={handleChange}
              />

              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
              />

              <input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
              />

              <input
                type="time"
                name="hora_fin"
                value={form.hora_fin}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
              />

              <button type="submit" className="btn-primary">
                Crear Reserva
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
