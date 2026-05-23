import API_URL from "./api";

// 🔹 Obtener reservas
export const getReservas = async () => {
  const response = await fetch(`${API_URL}/reservas`);

  if (!response.ok) {
    throw new Error("Error al obtener reservas");
  }

  return await response.json();
};

// 🔹 Crear reserva
export const crearReserva = async (data: any) => {
  const response = await fetch(`${API_URL}/reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear reserva");
  }

  return await response.json();
};

// 🔹 Cancelar reserva
export const cancelarReserva = async (id: number) => {
  const response = await fetch(`${API_URL}/reservas/${id}/cancelar`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Error al cancelar reserva");
  }

  return await response.json();
};
