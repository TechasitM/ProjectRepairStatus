import api from "./api";

export const customerService = {
  getAll: () => api.get("/customers"),

  create: (data) => api.post("/customers", data),

  update: (id, data) => api.put(`/customers/${id}`, data),

  delete: (id) => api.delete(`/customers/${id}`),
};