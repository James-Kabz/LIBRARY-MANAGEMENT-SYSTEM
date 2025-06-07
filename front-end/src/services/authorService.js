import { apiService } from "./api"

export const authorService = {
  async getAuthors(params = {}) {
    return apiService.get("/authors", params)
  },

  async getAuthor(id) {
    return apiService.get(`/authors/${id}`)
  },

  async createAuthor(data) {
    return apiService.post("/authors", data)
  },

  async updateAuthor(id, data) {
    return apiService.put(`/authors/${id}`, data)
  },

  async deleteAuthor(id) {
    return apiService.delete(`/authors/${id}`)
  },

  async searchAuthors(query, params = {}) {
    return apiService.get("/authors/search", { q: query, ...params })
  },
}
