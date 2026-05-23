import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import "../styles/pagos.css";
import {
  getPagos,
  crearPago,
  getMorosos,
  confirmarPago,
} from "../services/pagos.service";
import Loader from "../components/Loader";

export default function Pagos() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [morosos, setMorosos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    deportista_id: "",
    monto: "",
  });

  const cargarDatos = async () => {
    try {
      const data = await getPagos();
      const morososData = await getMorosos();

      setPagos(data);
      setMorosos(morososData);
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
      setForm({
        deportista_id: "",
        monto: "",
      });

      setModalOpen(true);
    }
  }, [searchParams]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await crearPago({
        deportista_id: Number(form.deportista_id),
        monto: Number(form.monto),
      });

      toast.success("Pago registrado");

      setForm({
        deportista_id: "",
        monto: "",
      });

      setModalOpen(false);

      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleConfirmar = async (id: number) => {
    try {
      await confirmarPago(id);
      toast.success("Pago confirmado");
      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="pagos-page">
      <div className="page-header">
        <h2 className="page-title">Pagos</h2>

        <p className="page-description">
          Gestiona pagos y control de morosidad del sistema deportivo.
        </p>
      </div>

      {/* FORM 
      <div className="form-card">
        <form onSubmit={handleSubmit} className="pagos-form">
          <input
            name="deportista_id"
            placeholder="Deportista ID"
            value={form.deportista_id}
            onChange={handleChange}
          />

          <input
            name="monto"
            placeholder="Monto"
            value={form.monto}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary">
            Registrar Pago
          </button>
        </form>
      </div>
      */}

      <div className="page-actions">
        <button
          className="btn-primary"
          onClick={() => {
            setForm({
              deportista_id: "",
              monto: "",
            });

            setModalOpen(true);
          }}
        >
          Nuevo Pago
        </button>

        <button
          className="btn-export"
          onClick={() => {
            window.open("http://localhost:3000/export/pagos/excel", "_blank");
          }}
        >
          📊 Exportar Excel
        </button>

        <button
          className="btn-export pdf"
          onClick={() => {
            window.open("http://localhost:3000/export/pagos/pdf", "_blank");
          }}
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* TABLA */}
      <div className="dashboard-section">
        <h3 className="section-title">Lista de pagos</h3>

        <div className="table-card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Deportista</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {pagos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>

                    <td>{p.deportista_id}</td>

                    <td className="monto">Bs. {p.monto}</td>

                    <td>
                      {p.fecha_pago
                        ? new Date(p.fecha_pago).toLocaleDateString()
                        : "Sin fecha"}
                    </td>

                    <td>
                      <span className="status paid">Confirmado</span>
                    </td>

                    <td>
                      <button
                        className="btn-confirm"
                        onClick={() => handleConfirmar(p.id)}
                      >
                        Confirmar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MOROSOS */}
      <div className="dashboard-section">
        <h3 className="section-title">Deportistas morosos</h3>

        <div className="morosos-grid">
          {morosos.map((m) => (
            <div className="moroso-card" key={m.id}>
              <div>
                <h4>{m.nombre_completo}</h4>

                <p>{m.email}</p>
              </div>

              <span className="status late">Moroso</span>
            </div>
          ))}
        </div>
      </div>
      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nuevo Pago</h3>

              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="deportista_id"
                placeholder="Deportista ID"
                value={form.deportista_id}
                onChange={handleChange}
              />

              <input
                name="monto"
                placeholder="Monto"
                value={form.monto}
                onChange={handleChange}
              />

              <button type="submit" className="btn-primary">
                Registrar Pago
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
