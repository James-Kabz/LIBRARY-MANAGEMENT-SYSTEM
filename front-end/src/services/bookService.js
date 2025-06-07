import { apiService } from "./api"

export const bookService = {
  async getBooks(params = {}) {
    return apiService.get("/books", params)
  },

  async getBook(id) {
    return apiService.get(`/books/${id}`)
  },

  async createBook(data) {
    return apiService.post("/books", data)
  },

  async updateBook(id, data) {
    return apiService.put(`/books/${id}`, data)
  },

  async deleteBook(id) {
    return apiService.delete(`/books/${id}`)
  },

  async searchBooks(query, params = {}) {
    return apiService.get("/books/search", { q: query, ...params })
  },

  async getAvailableBooks(params = {}) {
    return apiService.get("/books/available", params)
  },

  async getBooksByCategory(categoryId, params = {}) {
    return apiService.get(`/books/category/${categoryId}`, params)
  },

  async getBooksByAuthor(authorId, params = {}) {
    return apiService.get(`/books/author/${authorId}`, params)
  },
}
