import { apiService } from "./api"

export const categoryService = {
  async getCategories() {
    return apiService.get("/categories")
  },

  async getCategory(id) {
    return apiService.get(`/categories/${id}`)
  },

  async createCategory(data) {
    return apiService.post("/categories", data)
  },

  async updateCategory(id, data) {
    return apiService.put(`/categories/${id}`, data)
  },

  async deleteCategory(id) {
    return apiService.delete(`/categories/${id}`)
  },
}
