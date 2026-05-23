import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import "../styles/deportistas.css";
import {
  getDeportistas,
  crearDeportista,
  editarDeportista,
  eliminarDeportista,
} from "../services/deportistas.service";
import Loader from "../components/Loader";

export default function Deportistas() {
  const [deportistas, setDeportistas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 🟢 FORM STATE
  const [form, setForm] = useState({
    usuario_id: "",
    nombre_completo: "",
    ci: "",
    carrera: "",
  });

  // 🔹 Cargar datos
  const cargarDatos = async () => {
    try {
      const data = await getDeportistas();
      setDeportistas(data);
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
      setEditando(false);

      setForm({
        usuario_id: "",
        nombre_completo: "",
        ci: "",
        carrera: "",
      });

      setModalOpen(true);
    }
  }, [searchParams]);

  // 🔹 Manejar inputs
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Crear deportista
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (editando && idEditando !== null) {
        await editarDeportista(idEditando, form);
        toast.success("Deportista actualizado");
      } else {
        await crearDeportista({
          ...form,
          usuario_id: Number(form.usuario_id),
        });
        toast.success("Deportista creado");
      }

      setForm({
        usuario_id: "",
        nombre_completo: "",
        ci: "",
        carrera: "",
      });

      setEditando(false);
      setIdEditando(null);
      setModalOpen(false);

      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 🔹 Eliminar deportista
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar deportista?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",

      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#003b70",

      background: document.body.classList.contains("dark")
        ? "#1e293b"
        : "#ffffff",

      color: document.body.classList.contains("dark") ? "#f8fafc" : "#1f2937",
    });

    if (!result.isConfirmed) return;

    try {
      await eliminarDeportista(id);

      toast.success("Deportista eliminado");

      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 🔹 Editar deportista
  const handleEdit = (d: any) => {
    setForm({
      usuario_id: d.usuario_id,
      nombre_completo: d.nombre_completo,
      ci: d.ci,
      carrera: d.carrera,
    });

    setEditando(true);
    setIdEditando(d.id);
    setModalOpen(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="deportistas-page">
      <div className="page-header">
        <h2 className="page-title">Deportistas</h2>

        <p className="page-description">
          Gestiona deportistas registrados en el sistema.
        </p>
      </div>

      {/* FORM 
      <div className="form-card">
        <form onSubmit={handleSubmit} className="deportistas-form">
          <input
            name="usuario_id"
            placeholder="Usuario ID"
            value={form.usuario_id}
            onChange={handleChange}
          />

          <input
            name="nombre_completo"
            placeholder="Nombre completo"
            value={form.nombre_completo}
            onChange={handleChange}
          />

          <input
            name="ci"
            placeholder="CI"
            value={form.ci}
            onChange={handleChange}
          />

          <input
            name="carrera"
            placeholder="Carrera"
            value={form.carrera}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary">
            {editando ? "Actualizar" : "Crear Deportista"}
          </button>
        </form>
      </div>
      */}

      <div className="page-actions">
        <button
          className="btn-primary"
          onClick={() => {
            setForm({
              usuario_id: "",
              nombre_completo: "",
              ci: "",
              carrera: "",
            });

            setEditando(false);

            setIdEditando(null);

            setModalOpen(true);
          }}
        >
          Nuevo Deportista
        </button>

        <button
          className="btn-export"
          onClick={() => {
            window.open(
              "http://localhost:3000/export/deportistas/excel",
              "_blank",
            );
          }}
        >
          📊 Exportar Excel
        </button>

        <button
          className="btn-export pdf"
          onClick={() => {
            window.open(
              "http://localhost:3000/export/deportistas/pdf",
              "_blank",
            );
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
                <th>Nombre</th>
                <th>CI</th>
                <th>Carrera</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {deportistas.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>

                  <td>{d.nombre_completo}</td>

                  <td>{d.ci}</td>

                  <td>{d.carrera}</td>

                  <td>{d.email}</td>

                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(d)}>
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(d.id)}
                    >
                      Eliminar
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
              <h3>{editando ? "Editar Deportista" : "Nuevo Deportista"}</h3>

              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="usuario_id"
                placeholder="Usuario ID"
                value={form.usuario_id}
                onChange={handleChange}
              />

              <input
                name="nombre_completo"
                placeholder="Nombre"
                value={form.nombre_completo}
                onChange={handleChange}
              />

              <input
                name="ci"
                placeholder="CI"
                value={form.ci}
                onChange={handleChange}
              />

              <input
                name="carrera"
                placeholder="Carrera"
                value={form.carrera}
                onChange={handleChange}
              />

              <button type="submit" className="btn-primary">
                {editando ? "Actualizar Deportista" : "Crear Deportista"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
