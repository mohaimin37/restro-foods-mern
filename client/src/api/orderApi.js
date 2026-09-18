import api from "./axios";

export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const getMyOrders = () => api.get("/orders/my").then((r) => r.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const getAllOrders = (params) => api.get("/orders", { params }).then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status }).then((r) => r.data);
