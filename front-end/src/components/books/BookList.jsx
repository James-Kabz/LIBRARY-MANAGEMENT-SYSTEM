import { BookCard } from "./BookCard"
import { Loading } from "../ui/Loading"
import { Pagination } from "../ui/Pagination"

export const BookList = ({ books, pagination, isLoading, onPageChange, onReserve, showActions = true }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading size="lg" />
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No books found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onReserve={onReserve} showActions={showActions} />
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