import { create } from "zustand"
import { bookService } from "../services/bookService"
import toast from "react-hot-toast"

export const useBookStore = create((set, get) => ({
  books: [],
  pagination: null,
  isLoading: false,
  searchQuery: "",
  selectedCategory: null,
  selectedAuthor: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchBooks: async (params = {}) => {
    set({ isLoading: true })
    try {
      const response = await bookService.getBooks(params)
      set({
        books: response.data || [], // Fix: extract books from response.data
        pagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
          from: response.from,
          to: response.to,
        },
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error("Failed to fetch books")
    }
  },

  searchBooks: async (query, params = {}) => {
    set({ isLoading: true, searchQuery: query })
    try {
      const response = await bookService.searchBooks(query, params)
      set({
        books: response.data || [], // Fix: extract books from response.data
        pagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
          from: response.from,
          to: response.to,
        },
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error("Failed to search books")
    }
  },

  filterByCategory: async (categoryId, params = {}) => {
    set({ isLoading: true, selectedCategory: categoryId })
    try {
      const response = await bookService.getBooksByCategory(categoryId, params)
      set({
        books: response.data || [], // Fix: extract books from response.data
        pagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
          from: response.from,
          to: response.to,
        },
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error("Failed to filter books by category")
    }
  },

  filterByAuthor: async (authorId, params = {}) => {
    set({ isLoading: true, selectedAuthor: authorId })
    try {
      const response = await bookService.getBooksByAuthor(authorId, params)
      set({
        books: response.data || [], // Fix: extract books from response.data
        pagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
          from: response.from,
          to: response.to,
        },
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error("Failed to filter books by author")
    }
  },

  clearFilters: () => {
    set({
      searchQuery: "",
      selectedCategory: null,
      selectedAuthor: null,
    })
    get().fetchBooks()
  },

  createBook: async (bookData) => {
    try {
      await bookService.createBook(bookData)
      toast.success("Book created successfully")
      get().fetchBooks() // Refresh the list
    } catch (error) {
      toast.error("Failed to create book")
      throw error
    }
  },

  updateBook: async (id, bookData) => {
    try {
      await bookService.updateBook(id, bookData)
      toast.success("Book updated successfully")
      get().fetchBooks() // Refresh the list
    } catch (error) {
      toast.error("Failed to update book")
      throw error
    }
  },

  deleteBook: async (id) => {
    try {
      await bookService.deleteBook(id)
      toast.success("Book deleted successfully")
      get().fetchBooks() // Refresh the list
    } catch (error) {
      toast.error("Failed to delete book")
      throw error
    }
  },
}))
