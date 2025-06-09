"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { useAuthStore } from "../stores/authStore"
import { statsService } from "../services/statsService"
import { BookOpen, Users, Calendar, AlertTriangle, Tag, UserCheck } from "lucide-react"
import toast from "react-hot-toast"

export const Dashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    total_books: 0,
    available_books: 0,
    total_users: 0,
    total_categories: 0,
    total_authors: 0,
    total_reservations: 0,
    active_reservations: 0,
    overdue_reservations: 0,
    returned_reservations: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await statsService.getDashboardStats()
      setStats(response.data || {})
    } catch (error) {
      toast.error("Failed to fetch dashboard data")
      console.error("Dashboard data fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const memberStats = [
    {
      title: "Available Books",
      value: stats.available_books,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "My Active Reservations",
      value: stats.active_reservations,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const adminStats = [
    {
      title: "Total Books",
      value: stats.total_books,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Available Books",
      value: stats.available_books,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Users",
      value: stats.total_users,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Categories",
      value: stats.total_categories,
      icon: Tag,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Active Reservations",
      value: stats.active_reservations,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Overdue Books",
      value: stats.overdue_reservations,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Additional Stats for Admins */}
      {canManage && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.total_reservations}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Returned Books</p>
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.returned_reservations}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Authors</p>
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.total_authors}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading
                      ? "..."
                      : stats.total_books > 0
                        ? Math.round(((stats.total_books - stats.available_books) / stats.total_books) * 100)
                        : 0}
                    %
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response</span>
                <span className="text-sm font-medium text-green-600">Fast</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium text-blue-600">{stats.total_users}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Books Available</span>
                <span className="text-sm font-medium text-green-600">{stats.available_books}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
