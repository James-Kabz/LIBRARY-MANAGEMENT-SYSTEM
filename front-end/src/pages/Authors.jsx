"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Loading } from "../components/ui/Loading"
import { Pagination } from "../components/ui/Pagination"
import { useAuthStore } from "../stores/authStore"
import { authorService } from "../services/authorService"
import { Plus, Search, Edit, Trash2, User } from "lucide-react"
import toast from "react-hot-toast"

export const Authors = () => {
  const { user } = useAuthStore()
  const [authors, setAuthors] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    birth_date: "",
  })

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async (params = {}) => {
    setIsLoading(true)
    try {
      const response = await authorService.getAuthors(params)
      setAuthors(response.data?.data || response.data || [])
      setPagination(response.data || response)
    } catch (error) {
      toast.error("Failed to fetch authors")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchAuthors({ search: searchQuery })
    } else {
      fetchAuthors()
    }
  }

  const handlePageChange = (page) => {
    const params = searchQuery ? { search: searchQuery, page } : { page }
    fetchAuthors(params)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAuthor) {
        await authorService.updateAuthor(editingAuthor.id, formData)
        toast.success("Author updated successfully")
      } else {
        await authorService.createAuthor(formData)
        toast.success("Author created successfully")
      }
      setShowForm(false)
      setEditingAuthor(null)
      setFormData({ name: "", biography: "", birth_date: "" })
      fetchAuthors()
    } catch (error) {
      // Error handled by service
    }
  }

  const handleEdit = (author) => {
    setEditingAuthor(author)
    setFormData({
      name: author.name,
      biography: author.biography || "",
      birth_date: author.birth_date ? author.birth_date.split("T")[0] : "",
    })
    setShowForm(true)
  }

  const handleDelete = async (author) => {
    if (window.confirm(`Are you sure you want to delete "${author.name}"?`)) {
      try {
        await authorService.deleteAuthor(author.id)
        toast.success("Author deleted successfully")
        fetchAuthors()
      } catch (error) {
        // Error handled by service
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
          <p className="text-gray-600 mt-2">Manage authors in the library system</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Author
          </Button>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search authors..."
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
              fetchAuthors()
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Author Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingAuthor ? "Edit Author" : "Add New Author"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingAuthor ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingAuthor(null)
                      setFormData({ name: "", biography: "", birth_date: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Authors List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No authors found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Card key={author.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{author.name}</h3>
                        <p className="text-sm text-gray-600">Born: {formatDate(author.birth_date)}</p>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(author)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(author)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {author.biography && <p className="mt-3 text-sm text-gray-600 line-clamp-3">{author.biography}</p>}
                  <div className="mt-3 text-xs text-gray-500">Books: {author.books_count || 0}</div>
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
