"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { useAuthStore } from "../stores/authStore"
import { useBookStore } from "../stores/bookStore"
import { useReservationStore } from "../stores/reservationStore"
import { bookService } from "../services/bookService"
import { userService } from "../services/userService"
import { reservationService } from "../services/reservationService"
import { BookOpen, Users, Calendar, AlertTriangle } from "lucide-react"

export const Dashboard = () => {
  const { user } = useAuthStore()
  const { books } = useBookStore()
  const { reservations } = useReservationStore()
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalReservations: 0,
    overdueBooks: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        if (canManage) {
          // Fetch admin/librarian dashboard data
          const [booksResponse, availableBooksResponse, reservationsResponse, overdueUsersResponse] = await Promise.all(
            [
              bookService.getBooks({ per_page: 1 }),
              bookService.getAvailableBooks({ per_page: 1 }),
              reservationService.getReservations({ per_page: 1 }),
              userService.getUsersWithOverdueBooks(),
            ],
          )

          setStats({
            totalBooks: booksResponse.data?.total || 0,
            availableBooks: availableBooksResponse.data?.total || 0,
            totalReservations: reservationsResponse.data?.total || 0,
            overdueBooks: overdueUsersResponse.data?.length || 0,
          })
        } else {
          // Fetch member dashboard data
          const [booksResponse, userReservationsResponse] = await Promise.all([
            bookService.getAvailableBooks({ per_page: 1 }),
            reservationService.getReservationsByUser(user.id, { per_page: 1 }),
          ])

          setStats({
            totalBooks: 0,
            availableBooks: booksResponse.data?.total || 0,
            totalReservations: userReservationsResponse.data?.total || 0,
            overdueBooks: 0,
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, canManage])

  const memberStats = [
    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "My Reservations",
      value: stats.totalReservations,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const adminStats = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Reservations",
      value: stats.totalReservations,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  const statsToShow = canManage ? adminStats : memberStats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Here's what's happening in the library.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsToShow.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {canManage ? (
                <>
                  <a
                    href="/books/new"
                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium">Add New Book</span>
                    </div>
                  </a>
                  <a
                    href="/reservations"
                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium">Manage Reservations</span>
                    </div>
                  </a>
                  <a
                    href="/users"
                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium">Manage Users</span>
                    </div>
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/books"
                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium">Browse Books</span>
                    </div>
                  </a>
                  <a
                    href="/my-reservations"
                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium">My Reservations</span>
                    </div>
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <p>• System is running smoothly</p>
                <p>• All services are operational</p>
                <p>• Database is up to date</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
