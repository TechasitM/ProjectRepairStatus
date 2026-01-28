import api from "./api";

export const authService = {
  login: (data) => api.post("/login", data),

  logout: () => api.post("/logout"),

  profile: () => api.get("/user-profile"),
};
