"use client"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { BookOpen, User, Calendar } from "lucide-react"

export const BookCard = ({ book, onReserve, showActions = true }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <User className="h-4 w-4 mr-1" />
              {book.author.name}
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {book.published_year}
            </div>
          </div>
          <div className="ml-4">
            {book.cover_image ? (
              <img
                src={book.cover_image || "/placeholder.svg"}
                alt={book.title}
                className="w-16 h-20 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {book.categories.map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>

          {book.description && <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">ISBN: {book.isbn}</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">
                Available: {book.available_copies}/{book.total_copies}
              </span>
              <Badge variant={book.is_available ? "default" : "destructive"} className="text-xs">
                {book.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-0">
          <div className="flex space-x-2 w-full">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to={`/books/${book.id}`}>View Details</Link>
            </Button>
            {book.is_available && onReserve && (
              <Button size="sm" className="flex-1" onClick={() => onReserve(book)}>
                Reserve
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
