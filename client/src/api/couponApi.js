import api from "./axios";

export const validateCoupon = (code, subtotal) =>
  api.post("/coupons/validate", { code, subtotal }).then((r) => r.data);
export const getAllCoupons = () => api.get("/coupons").then((r) => r.data);
export const createCoupon = (payload) => api.post("/coupons", payload).then((r) => r.data);
export const updateCoupon = (id, payload) => api.put(`/coupons/${id}`, payload).then((r) => r.data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`).then((r) => r.data);
