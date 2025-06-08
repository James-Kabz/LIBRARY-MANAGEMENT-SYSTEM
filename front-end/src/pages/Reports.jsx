"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Loading } from "../components/ui/Loading"
import { useAuthStore } from "../stores/authStore"
import { statsService } from "../services/statsService"
import { BarChart3, BookOpen, Users, Calendar, TrendingUp, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

export const Reports = () => {
  const { user } = useAuthStore()
  const [reportsData, setReportsData] = useState({
    overview: {},
    popular_books: [],
    recent_reservations: [],
    categories_stats: [],
    monthly_stats: {},
  })
  const [isLoading, setIsLoading] = useState(true)

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  useEffect(() => {
    if (canManage) {
      fetchReportsData()
    }
  }, [canManage])

  const fetchReportsData = async () => {
    setIsLoading(true)
    try {
      const response = await statsService.getReportsData()
      setReportsData(response.data || {})
    } catch (error) {
      toast.error("Failed to fetch reports data")
      console.error("Reports data fetch error:", error)
    } finally {
      setIsLoading(false)
    }
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

  const { overview = {}, popular_books = [], monthly_stats = {} } = reportsData

  const reportCards = [
    {
      title: "Total Books",
      value: overview.total_books || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: overview.total_users || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Reservations",
      value: overview.total_reservations || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Reservations",
      value: overview.active_reservations || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Overdue Books",
      value: overview.overdue_reservations || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Overview of library system statistics and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-gray-400" />
          <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {reportCards.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Additional Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Books */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Books</CardTitle>
              </CardHeader>
              <CardContent>
                {popular_books.length > 0 ? (
                  <div className="space-y-3">
                    {popular_books.map((book, index) => (
                      <div key={book.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-sm text-gray-600">by {book.author?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">#{index + 1}</p>
                          <p className="text-xs text-gray-600">
                            {(book.total_copies || 0) - (book.available_copies || 0)} reserved
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Monthly Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Books Added</span>
                    <span className="text-sm font-medium text-blue-600">
                      {monthly_stats.books_added_this_month || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Reservations</span>
                    <span className="text-sm font-medium text-green-600">
                      {monthly_stats.reservations_this_month || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Users Joined</span>
                    <span className="text-sm font-medium text-purple-600">
                      {monthly_stats.users_joined_this_month || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Books Returned</span>
                    <span className="text-sm font-medium text-orange-600">
                      {monthly_stats.books_returned_this_month || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Overview */}
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{overview.total_books || 0}</p>
                  <p className="text-sm text-gray-600">Books in Collection</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{overview.available_books || 0}</p>
                  <p className="text-sm text-gray-600">Available Books</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{overview.total_users || 0}</p>
                  <p className="text-sm text-gray-600">Registered Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {overview.total_books > 0
                      ? Math.round(((overview.active_reservations || 0) / overview.total_books) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-gray-600">Utilization Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
