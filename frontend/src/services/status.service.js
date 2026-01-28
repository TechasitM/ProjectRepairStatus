import api from "./api";

export const statusService = {
  getAll: () => api.get("/repair-statuses"),

  create: (data) => api.post("/repair-statuses", data),

  update: (id, data) => api.put(`/repair-statuses/${id}`, data),

  delete: (id) => api.delete(`/repair-statuses/${id}`),
};
