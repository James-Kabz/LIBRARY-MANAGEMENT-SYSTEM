"use client"

import { useState } from "react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Search, X } from "lucide-react"

export const BookSearch = ({
  onSearch,
  onClear,
  placeholder = "Search books by title, author, or ISBN...",
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery("")
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" disabled={!query.trim()}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}
