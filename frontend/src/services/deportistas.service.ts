import API_URL from "./api";

export const getDeportistas = async () => {
  const response = await fetch(`${API_URL}/deportistas`);

  if (!response.ok) {
    throw new Error("Error al obtener deportistas");
  }

  return await response.json();
};

export const crearDeportista = async (data: any) => {
  const response = await fetch("http://localhost:3000/deportistas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear deportista");
  }

  return await response.json();
};

export const eliminarDeportista = async (id: number) => {
  const response = await fetch(`http://localhost:3000/deportistas/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar");
  }

  return await response.json();
};

export const editarDeportista = async (id: number, data: any) => {
  const response = await fetch(`http://localhost:3000/deportistas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al editar");
  }

  return await response.json();
};
