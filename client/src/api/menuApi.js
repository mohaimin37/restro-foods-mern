import api from "./axios";

export const getMenuItems = (params) => api.get("/menu", { params }).then((r) => r.data);
export const getFeaturedItems = () => api.get("/menu/featured").then((r) => r.data);
export const getMenuItemById = (id) => api.get(`/menu/${id}`).then((r) => r.data);
export const createMenuItem = (payload) => api.post("/menu", payload).then((r) => r.data);
export const updateMenuItem = (id, payload) => api.put(`/menu/${id}`, payload).then((r) => r.data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`).then((r) => r.data);
