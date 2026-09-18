import api from "./axios";

export const getDashboardStats = () => api.get("/admin/dashboard").then((r) => r.data);
export const getAllUsers = () => api.get("/admin/users").then((r) => r.data);
export const toggleUserActive = (id) =>
  api.put(`/admin/users/${id}/toggle-active`).then((r) => r.data);
