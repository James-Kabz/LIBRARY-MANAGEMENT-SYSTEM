import { create } from "zustand"
import { bookService } from "../services/bookService"

export const useBookStore = create((set, get) => ({
  books: [],
  currentBook: null,
  pagination: null,
  isLoading: false,
  searchQuery: "",
  selectedCategory: null,
  selectedAuthor: null,

  // Actions
  fetchBooks: async (params) => {
    set({ isLoading: true })
    try {
      const response = await bookService.getBooks(params)
      const { data, ...pagination } = response.data
      set({ books: data, pagination, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  fetchBook: async (id) => {
    set({ isLoading: true })
    try {
      const response = await bookService.getBook(id)
      set({ currentBook: response.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  searchBooks: async (query, params) => {
    set({ isLoading: true, searchQuery: query })
    try {
      const response = await bookService.searchBooks(query, params)
      const { data, ...pagination } = response.data
      set({ books: data, pagination, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  filterByCategory: async (categoryId) => {
    set({ isLoading: true, selectedCategory: categoryId })
    try {
      if (categoryId) {
        const response = await bookService.getBooksByCategory(categoryId)
        const { data, ...pagination } = response.data
        set({ books: data, pagination, isLoading: false })
      } else {
        get().fetchBooks()
      }
    } catch (error) {
      set({ isLoading: false })
    }
  },

  filterByAuthor: async (authorId) => {
    set({ isLoading: true, selectedAuthor: authorId })
    try {
      if (authorId) {
        const response = await bookService.getBooksByAuthor(authorId)
        const { data, ...pagination } = response.data
        set({ books: data, pagination, isLoading: false })
      } else {
        get().fetchBooks()
      }
    } catch (error) {
      set({ isLoading: false })
    }
  },

  createBook: async (data) => {
    await bookService.createBook(data)
    get().fetchBooks()
  },

  updateBook: async (id, data) => {
    await bookService.updateBook(id, data)
    get().fetchBooks()
    if (get().currentBook?.id === id) {
      get().fetchBook(id)
    }
  },

  deleteBook: async (id) => {
    await bookService.deleteBook(id)
    get().fetchBooks()
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  clearFilters: () => {
    set({
      searchQuery: "",
      selectedCategory: null,
      selectedAuthor: null,
    })
    get().fetchBooks()
  },
}))
