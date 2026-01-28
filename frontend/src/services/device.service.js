import api from "./api";

export const deviceService = {
  getAll: () => api.get("/devices"),

  create: (data) => api.post("/devices", data),
};
