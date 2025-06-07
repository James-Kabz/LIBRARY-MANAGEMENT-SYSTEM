import { ReservationCard } from "./ReservationCard"
import { Loading } from "../ui/Loading"
import { Pagination } from "../ui/Pagination"

export const ReservationList = ({
  reservations,
  pagination,
  isLoading,
  onPageChange,
  onReturn,
  showUserInfo = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading size="lg" />
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reservations found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onReturn={onReturn}
            showUserInfo={showUserInfo}
          />
        ))}
      </div>

      {pagination && onPageChange && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          onPageChange={onPageChange}
          className="mt-8"
        />
      )}
    </div>
  )
}
