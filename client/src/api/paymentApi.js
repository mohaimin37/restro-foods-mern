import api from "./axios";

export const createCheckoutSession = (payload) =>
  api.post("/payments/create-checkout-session", payload).then((r) => r.data);
export const verifyCheckoutSession = (sessionId) =>
  api.get(`/payments/session/${sessionId}`).then((r) => r.data);
