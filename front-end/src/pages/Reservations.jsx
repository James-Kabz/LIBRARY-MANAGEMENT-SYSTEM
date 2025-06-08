"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Loading } from "../components/ui/Loading"
import { Pagination } from "../components/ui/Pagination"
import { Badge } from "../components/ui/Badge"
import { useAuthStore } from "../stores/authStore"
import { reservationService } from "../services/reservationService"
import { Search, Calendar, User, BookOpen, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"

export const Reservations = () => {
  const { user } = useAuthStore()
  const [reservations, setReservations] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  useEffect(() => {
    if (canManage) {
      fetchReservations()
    }
  }, [canManage])

  const fetchReservations = async (params = {}) => {
    setIsLoading(true)
    try {
      const response = await reservationService.getReservations(params)
      setReservations(response.data?.data || response.data || [])
      setPagination(response.data || response)
    } catch (error) {
      toast.error("Failed to fetch reservations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (searchQuery.trim()) params.search = searchQuery
    if (statusFilter !== "all") params.status = statusFilter
    fetchReservations(params)
  }

  const handlePageChange = (page) => {
    const params = { page }
    if (searchQuery.trim()) params.search = searchQuery
    if (statusFilter !== "all") params.status = statusFilter
    fetchReservations(params)
  }

  const handleReturnBook = async (reservation) => {
    try {
      await reservationService.returnBook(reservation.id)
      toast.success("Book returned successfully")
      fetchReservations()
    } catch (error) {
      // Error handled by service
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      case "returned":
        return <Badge className="bg-green-100 text-green-800">Returned</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate
  }

  if (!canManage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-2">Manage book reservations in the library system</p>
        </div>
      </div>

      {/* Search and Filters */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by user name, book title, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        {(searchQuery || statusFilter !== "all") && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
              fetchReservations()
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Reservations List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reservations found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{reservation.book?.title}</h3>
                            <p className="text-sm text-gray-600">ISBN: {reservation.book?.isbn}</p>
                          </div>
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>
                            <strong>User:</strong> {reservation.user?.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            <strong>Reserved:</strong> {formatDate(reservation.reserved_at)}
                          </span>
                        </div>
                        {reservation.due_date && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className={isOverdue(reservation.due_date) ? "text-red-600" : ""}>
                              <strong>Due:</strong> {formatDate(reservation.due_date)}
                            </span>
                          </div>
                        )}
                      </div>

                      {reservation.returned_at && (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            <strong>Returned:</strong> {formatDate(reservation.returned_at)}
                          </span>
                        </div>
                      )}
                    </div>

                    {reservation.status === "active" && (
                      <Button size="sm" onClick={() => handleReturnBook(reservation)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Returned
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </div>
      )}
    </div>
  )
}
