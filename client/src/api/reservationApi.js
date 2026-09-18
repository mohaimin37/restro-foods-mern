import api from "./axios";

export const createReservation = (payload) => api.post("/reservations", payload).then((r) => r.data);
export const getMyReservations = () => api.get("/reservations/my").then((r) => r.data);
export const cancelMyReservation = (id) =>
  api.put(`/reservations/${id}/cancel`).then((r) => r.data);
export const getAllReservations = (params) =>
  api.get("/reservations", { params }).then((r) => r.data);
export const updateReservation = (id, payload) =>
  api.put(`/reservations/${id}`, payload).then((r) => r.data);
