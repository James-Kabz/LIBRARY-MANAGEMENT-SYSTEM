import { create } from "zustand"
import { reservationService } from "../services/reservationService"
import toast from "react-hot-toast"

export const useReservationStore = create((set, get) => ({
  reservations: [],
  pagination: null,
  isLoading: false,
  error: null,

  // Fetch all reservations
  fetchReservations: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await reservationService.getReservations(params)
      set({
        reservations: response.data || [],
        pagination: response.meta || response.pagination || null,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        reservations: [],
        pagination: null,
      })
      toast.error("Failed to fetch reservations")
    }
  },

  // Fetch reservations by user
  fetchUserReservations: async (userId, params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await reservationService.getReservationsByUser(userId, params)
      set({
        reservations: response.data || [],
        pagination: response.meta || response.pagination || null,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        reservations: [],
        pagination: null,
      })
      toast.error("Failed to fetch user reservations")
    }
  },

  // Fetch reservations by book
  fetchBookReservations: async (bookId, params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await reservationService.getReservationsByBook(bookId, params)
      set({
        reservations: response.data || [],
        pagination: response.meta || response.pagination || null,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        reservations: [],
        pagination: null,
      })
      toast.error("Failed to fetch book reservations")
    }
  },

  // Create reservation
  createReservation: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await reservationService.createReservation(data)
      const newReservation = response.data

      set((state) => ({
        reservations: [newReservation, ...state.reservations],
        isLoading: false,
      }))

      toast.success("Book reserved successfully!")
      return newReservation
    } catch (error) {
      set({ error: error.message, isLoading: false })
      toast.error("Failed to reserve book")
      throw error
    }
  },

  // Return book
  returnBook: async (reservationId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await reservationService.returnBook(reservationId)
      const updatedReservation = response.data

      set((state) => ({
        reservations: state.reservations.map((reservation) =>
          reservation.id === reservationId ? updatedReservation : reservation,
        ),
        isLoading: false,
      }))

      toast.success("Book returned successfully!")
      return updatedReservation
    } catch (error) {
      set({ error: error.message, isLoading: false })
      toast.error("Failed to return book")
      throw error
    }
  },

  // Get reservation by ID
  getReservation: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await reservationService.getReservation(id)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      toast.error("Failed to fetch reservation")
      throw error
    }
  },

  // Clear reservations
  clearReservations: () => {
    set({
      reservations: [],
      pagination: null,
      error: null,
    })
  },
}))
