"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { formatDate, isOverdue, getDaysOverdue } from "../../lib/utils"
import { Calendar, User, BookOpen, Clock } from "lucide-react"

export const ReservationCard = ({ reservation, onReturn, showUserInfo = false }) => {
  const overdue = isOverdue(reservation.due_date)
  const daysOverdue = getDaysOverdue(reservation.due_date)

  return (
    <Card className={`${overdue ? "border-red-200 bg-red-50" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{reservation.book.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <User className="h-4 w-4 mr-1" />
              {reservation.book.author.name}
            </div>
            {showUserInfo && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <User className="h-4 w-4 mr-1" />
                {reservation.user.name}
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-col items-end space-y-2">
            <Badge variant={reservation.status === "borrowed" ? "default" : "secondary"}>{reservation.status}</Badge>
            {overdue && <Badge variant="destructive">{daysOverdue} days overdue</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-gray-600">Reserved</p>
                <p className="font-medium">{formatDate(reservation.reserved_at)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-gray-600">Due Date</p>
                <p className={`font-medium ${overdue ? "text-red-600" : ""}`}>{formatDate(reservation.due_date)}</p>
              </div>
            </div>
          </div>

          {reservation.returned_at && (
            <div className="flex items-center text-sm">
              <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-gray-600">Returned</p>
                <p className="font-medium text-green-600">{formatDate(reservation.returned_at)}</p>
              </div>
            </div>
          )}

          {reservation.status === "borrowed" && onReturn && (
            <div className="pt-2">
              <Button
                onClick={() => onReturn(reservation)}
                className="w-full"
                variant={overdue ? "destructive" : "default"}
              >
                Return Book
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
