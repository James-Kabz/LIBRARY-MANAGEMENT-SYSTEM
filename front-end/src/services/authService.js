import { apiService } from "./api"

export const authService = {
  async login(credentials) {
    return apiService.post("/login", credentials)
  },

  async register(data) {
    return apiService.post("/register", data)
  },

  async logout() {
    return apiService.post("/logout")
  },

  async me() {
    return apiService.get("/me")
  },
}
