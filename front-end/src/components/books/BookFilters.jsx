"use client"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { X } from "lucide-react"

export const BookFilters = ({
  authors,
  categories,
  selectedAuthor,
  selectedCategory,
  onAuthorChange,
  onCategoryChange,
  onClearFilters,
}) => {
  const hasActiveFilters = selectedAuthor || selectedCategory

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedAuthor && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Author: {authors.find((a) => a.id === selectedAuthor)?.name}
              <button onClick={() => onAuthorChange(null)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find((c) => c.id === selectedCategory)?.name}
              <button onClick={() => onCategoryChange(null)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Category filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(selectedCategory === category.id ? null : category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Author filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Authors</h4>
        <div className="max-h-40 overflow-y-auto">
          <div className="space-y-1">
            {authors.map((author) => (
              <Button
                key={author.id}
                variant={selectedAuthor === author.id ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => onAuthorChange(selectedAuthor === author.id ? null : author.id)}
              >
                {author.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
