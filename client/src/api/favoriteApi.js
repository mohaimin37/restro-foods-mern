import api from "./axios";

export const getMyFavorites = () => api.get("/favorites").then((r) => r.data);
export const addFavorite = (menuItemId) => api.post(`/favorites/${menuItemId}`).then((r) => r.data);
export const removeFavorite = (menuItemId) => api.delete(`/favorites/${menuItemId}`).then((r) => r.data);
