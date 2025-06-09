"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/Button"
import { BookList } from "../components/books/BookList"
import { BookSearch } from "../components/books/BookSearch"
import { BookFilters } from "../components/books/BookFilters"
import { useBookStore } from "../stores/bookStore"
import { useAuthStore } from "../stores/authStore"
import { useReservationStore } from "../stores/reservationStore"
import { authorService } from "../services/authorService"
import { categoryService } from "../services/categoryService"
import { Plus, Filter } from "lucide-react"
import toast from "react-hot-toast"

export const Books = () => {
  const { user } = useAuthStore()
  const {
    books,
    pagination,
    isLoading,
    searchQuery,
    selectedCategory,
    selectedAuthor,
    fetchBooks,
    searchBooks,
    filterByCategory,
    filterByAuthor,
    setSearchQuery,
    clearFilters,
  } = useBookStore()
  const { createReservation } = useReservationStore()

  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  useEffect(() => {
    fetchBooks()
    fetchAuthorsAndCategories()
  }, [fetchBooks])

  const fetchAuthorsAndCategories = async () => {
    try {
      const [authorsResponse, categoriesResponse] = await Promise.all([
        authorService.getAuthors({ per_page: 100 }),
        categoryService.getCategories(),
      ])
      setAuthors(authorsResponse.data?.data || [])
      setCategories(categoriesResponse.data || [])
    } catch (error) {
      console.error("Failed to fetch authors and categories:", error)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    searchBooks(query)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    clearFilters()
  }

  const handlePageChange = (page) => {
    if (searchQuery) {
      searchBooks(searchQuery, { page })
    } else if (selectedCategory) {
      filterByCategory(selectedCategory)
    } else if (selectedAuthor) {
      filterByAuthor(selectedAuthor)
    } else {
      fetchBooks({ page })
    }
  }

  const handleReserveBook = async (book) => {
    if (!user) return

    try {
      await createReservation({
        user_id: user.id,
        book_id: book.id,
      })
      toast.success("Book reserved successfully!")
      fetchBooks() // Refresh to update availability
    } catch (error) {
      // Error handling is done in the service layer
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-600 mt-2">Browse and search through our collection of books</p>
        </div>
        {canManage && (
          <Button asChild>
            <a href="/books/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </a>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <BookSearch onSearch={handleSearch} onClear={handleClearSearch} initialValue={searchQuery} />

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {(selectedCategory || selectedAuthor || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg border">
            <BookFilters
              authors={authors}
              categories={categories}
              selectedAuthor={selectedAuthor}
              selectedCategory={selectedCategory}
              onAuthorChange={filterByAuthor}
              onCategoryChange={filterByCategory}
              onClearFilters={clearFilters}
            />
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {pagination && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {pagination.from}-{pagination.to} of {pagination.total} books
          </div>
        )}

        <BookList
          books={books}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onReserve={!canManage ? handleReserveBook : undefined}
          showActions={true}
        />
      </div>
    </div>
  )
}
