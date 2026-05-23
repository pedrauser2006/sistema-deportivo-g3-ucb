import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import "../styles/disciplinas.css";
import {
  getDisciplinas,
  crearDisciplina,
  editarDisciplina,
  eliminarDisciplina,
} from "../services/disciplinas.service";
import Loader from "../components/Loader";

export default function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ nombre: "" });
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const cargarDatos = async () => {
    try {
      const data = await getDisciplinas();
      setDisciplinas(data);
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
        nombre: "",
      });

      setModalOpen(true);
    }
  }, [searchParams]);

  const handleChange = (e: any) => {
    setForm({ nombre: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (editando && idEditando !== null) {
        await editarDisciplina(idEditando, form);
        toast.success("Disciplina actualizada");
      } else {
        await crearDisciplina(form);
        toast.success("Disciplina creada");
      }

      setForm({ nombre: "" });
      setEditando(false);
      setIdEditando(null);
      setModalOpen(false);

      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (d: any) => {
    setForm({
      nombre: d.nombre,
    });

    setEditando(true);

    setIdEditando(d.id);

    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar disciplina?",
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
      await eliminarDisciplina(id);

      toast.success("Disciplina eliminada");

      cargarDatos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="disciplinas-page">
      <div className="page-header">
        <h2 className="page-title">Disciplinas</h2>

        <p className="page-description">
          Gestiona disciplinas deportivas registradas en el sistema.
        </p>
      </div>

      {/* FORM 
      <div className="form-card">
        <form onSubmit={handleSubmit} className="disciplinas-form">
          <input
            placeholder="Nombre disciplina"
            value={form.nombre}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary">
            {editando ? "Actualizar" : "Crear Disciplina"}
          </button>
        </form>
      </div>
      */}

      <div className="disciplinas-actions">
        <button
          className="btn-primary"
          onClick={() => {
            setEditando(false);

            setForm({ nombre: "" });

            setModalOpen(true);
          }}
        >
          Nueva Disciplina
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
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {disciplinas.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>

                  <td>{d.nombre}</td>

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
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editando ? "Editar Disciplina" : "Nueva Disciplina"}</h3>

              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                placeholder="Nombre disciplina"
                value={form.nombre}
                onChange={handleChange}
              />

              <button type="submit" className="btn-primary">
                {editando ? "Actualizar" : "Crear"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
