"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Loading } from "../components/ui/Loading"
import { Pagination } from "../components/ui/Pagination"
import { Badge } from "../components/ui/Badge"
import { useAuthStore } from "../stores/authStore"
import { userService } from "../services/userService"
import { Search, User, Mail, Calendar, Shield } from "lucide-react"
import toast from "react-hot-toast"

export const Users = () => {
  const { user } = useAuthStore()
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const isAdmin = user?.roles?.includes("admin")

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async (params = {}) => {
    setIsLoading(true)
    try {
      const response = await userService.getUsers(params)
      setUsers(response.data?.data || response.data || [])
      setPagination(response.data || response)
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchUsers({ search: searchQuery })
    } else {
      fetchUsers()
    }
  }

  const handlePageChange = (page) => {
    const params = searchQuery ? { search: searchQuery, page } : { page }
    fetchUsers(params)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "librarian":
        return "bg-blue-100 text-blue-800"
      case "member":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAdmin) {
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
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage users in the library system</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        {searchQuery && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              fetchUsers()
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Users List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((userData) => (
              <Card key={userData.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{userData.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {userData.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {formatDate(userData.created_at)}
                      </div>
                      <div className="flex items-center mt-2">
                        <Shield className="h-4 w-4 mr-1 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {userData.roles?.map((role) => (
                            <Badge key={role} className={getRoleBadgeColor(role)}>
                              {role}
                            </Badge>
                          )) || <Badge className="bg-gray-100 text-gray-800">member</Badge>}
                        </div>
                      </div>
                      {userData.phone && <p className="text-sm text-gray-600 mt-2">Phone: {userData.phone}</p>}
                      {userData.address && <p className="text-sm text-gray-600 mt-1">Address: {userData.address}</p>}
                      <div className="mt-3 text-xs text-gray-500">
                        Active Reservations: {userData.active_reservations_count || 0}
                      </div>
                    </div>
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
