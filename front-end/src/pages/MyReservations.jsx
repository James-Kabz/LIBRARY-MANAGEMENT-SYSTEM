"use client"

import { useEffect } from "react"
import { ReservationList } from "../components/reservations/ReservationList"
import { useAuthStore } from "../stores/authStore"
import { useReservationStore } from "../stores/reservationStore"

export const MyReservations = () => {
  const { user } = useAuthStore()
  const { reservations, pagination, isLoading, fetchUserReservations, returnBook } = useReservationStore()

  useEffect(() => {
    if (user?.id) {
      fetchUserReservations(user.id)
    }
  }, [user?.id, fetchUserReservations])

  const handlePageChange = (page) => {
    if (user?.id) {
      fetchUserReservations(user.id, { page })
    }
  }

  const handleReturnBook = async (reservation) => {
    try {
      await returnBook(reservation.id)
      // Refresh the list after successful return
      if (user?.id) {
        fetchUserReservations(user.id)
      }
    } catch (error) {
      // Error handling is done in the store
      console.error("Failed to return book:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
        <p className="text-gray-600 mt-2">View and manage your book reservations</p>
      </div>

      <ReservationList
        reservations={reservations}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onReturn={handleReturnBook}
        showUserInfo={false}
      />
    </div>
  )
}
