import API_URL from "./api";

// 🔹 listar
export const getDisciplinas = async () => {
  const res = await fetch(`${API_URL}/disciplinas`);
  if (!res.ok) throw new Error("Error al obtener disciplinas");
  return await res.json();
};

// 🔹 crear
export const crearDisciplina = async (data: any) => {
  const res = await fetch(`${API_URL}/disciplinas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear disciplina");
  }

  return await res.json();
};

// 🔹 editar
export const editarDisciplina = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/disciplinas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al editar disciplina");
  }

  return await res.json();
};

// 🔹 eliminar
export const eliminarDisciplina = async (id: number) => {
  const res = await fetch(`${API_URL}/disciplinas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar disciplina");

  return await res.json();
};
