import API_URL from "./api";

// 🔹 listar pagos
export const getPagos = async () => {
  const res = await fetch(`${API_URL}/pagos`);
  if (!res.ok) throw new Error("Error al obtener pagos");
  return await res.json();
};

// 🔹 registrar pago
export const crearPago = async (data: any) => {
  const res = await fetch(`${API_URL}/pagos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al registrar pago");
  }

  return await res.json();
};

// 🔹 ver pagos por deportista
export const getPagosDeportista = async (id: number) => {
  const res = await fetch(`${API_URL}/pagos/deportista/${id}`);
  if (!res.ok) throw new Error("Error al obtener pagos del deportista");
  return await res.json();
};

// 🔹 morosos
export const getMorosos = async () => {
  const res = await fetch(`${API_URL}/pagos/morosos`);
  if (!res.ok) throw new Error("Error al obtener morosos");
  return await res.json();
};

// 🔹 confirmar pago
export const confirmarPago = async (id: number) => {
  const res = await fetch(`${API_URL}/pagos/${id}/confirmar`, {
    method: "PUT",
  });

  if (!res.ok) throw new Error("Error al confirmar pago");

  return await res.json();
};
