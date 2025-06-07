import { apiService } from "./api"

export const userService = {
  async getUsers(params = {}) {
    return apiService.get("/users", params)
  },

  async getUser(id) {
    return apiService.get(`/users/${id}`)
  },

  async createUser(data) {
    return apiService.post("/users", data)
  },

  async updateUser(id, data) {
    return apiService.put(`/users/${id}`, data)
  },

  async deleteUser(id) {
    return apiService.delete(`/users/${id}`)
  },

  async getUsersWithOverdueBooks() {
    return apiService.get("/users/overdue/books")
  },
}
