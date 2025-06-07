import { create } from "zustand"
import { reservationService } from "../services/reservationService"

export const useReservationStore = create((set, get) => ({
  reservations: [],
  currentReservation: null,
  pagination: null,
  isLoading: false,

  // Actions
  fetchReservations: async (params) => {
    set({ isLoading: true })
    try {
      const response = await reservationService.getReservations(params)
      const { data, ...pagination } = response.data
      set({ reservations: data, pagination, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  fetchReservation: async (id) => {
    set({ isLoading: true })
    try {
      const response = await reservationService.getReservation(id)
      set({ currentReservation: response.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  fetchUserReservations: async (userId, params) => {
    set({ isLoading: true })
    try {
      const response = await reservationService.getReservationsByUser(userId, params)
      const { data, ...pagination } = response.data
      set({ reservations: data, pagination, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  createReservation: async (data) => {
    await reservationService.createReservation(data)
    get().fetchReservations()
  },

  returnBook: async (id) => {
    await reservationService.returnBook(id)
    get().fetchReservations()
    if (get().currentReservation?.id === id) {
      get().fetchReservation(id)
    }
  },
}))
