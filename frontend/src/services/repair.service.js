import api from "./api";

export const repairService = {
  // ===== PUBLIC =====
  track: (code) => api.get(`/repairs/${code}`),

  trackByPhone: (phone) => api.get(`/track/phone/${phone}`),

  // ===== ADMIN =====
  getAll: () => api.get("/repairs"),

  getById: (id) => api.get(`/repairs/${id}`),

  create: (data) => api.post("/repairs", data),

  update: (id, data) => api.put(`/repairs/${id}`, data),

  delete: (id) => api.delete(`/repairs/${id}`),

  updateStatus: (id, status_id) =>
    api.patch(`/repairs/${id}/status`, { status_id }),
};
