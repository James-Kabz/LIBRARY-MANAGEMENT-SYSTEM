import { apiService } from "./api"

export const reservationService = {
  async getReservations(params = {}) {
    return apiService.get("/reservations", params)
  },

  async getReservation(id) {
    return apiService.get(`/reservations/${id}`)
  },

  async createReservation(data) {
    return apiService.post("/reservations", data)
  },

  async returnBook(id) {
    return apiService.patch(`/reservations/${id}/return`)
  },

  async getReservationsByUser(userId, params = {}) {
    return apiService.get(`/reservations/user/${userId}`, params)
  },

  async getReservationsByBook(bookId, params = {}) {
    return apiService.get(`/reservations/book/${bookId}`, params)
  },
}
