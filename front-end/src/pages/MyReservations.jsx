"use client"

import { useEffect } from "react"
import { ReservationList } from "../components/reservations/ReservationList"
import { useAuthStore } from "../stores/authStore"
import { useReservationStore } from "../stores/reservationStore"
import toast from "react-hot-toast"

export const MyReservations = () => {
  const { user } = useAuthStore()
  const { reservations, pagination, isLoading, fetchUserReservations, returnBook } = useReservationStore()

  useEffect(() => {
    if (user) {
      fetchUserReservations(user.id)
    }
  }, [user])

  const handlePageChange = (page) => {
    if (user) {
      fetchUserReservations(user.id, { page })
    }
  }

  const handleReturnBook = async (reservation) => {
    try {
      await returnBook(reservation.id)
      toast.success("Book returned successfully!")
      if (user) {
        fetchUserReservations(user.id) // Refresh the list
      }
    } catch (error) {
      // Error handling is done in the service layer
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
