import api from "./axios";

export const getReviewsForItem = (menuItemId) =>
  api.get(`/reviews/${menuItemId}`).then((r) => r.data);
export const createReview = (menuItemId, payload) =>
  api.post(`/reviews/${menuItemId}`, payload).then((r) => r.data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((r) => r.data);
export const getAllReviews = () => api.get("/reviews").then((r) => r.data);
