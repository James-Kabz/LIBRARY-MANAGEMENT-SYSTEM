"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Loading } from "../components/ui/Loading"
import { useAuthStore } from "../stores/authStore"
import { categoryService } from "../services/categoryService"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import toast from "react-hot-toast"

export const Categories = () => {
  const { user } = useAuthStore()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await categoryService.getCategories()
      // Handle both direct array and nested data structure
      const categoriesData = response.data || response || []
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      toast.error("Failed to fetch categories")
      console.error("Categories fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData)
        toast.success("Category updated successfully")
      } else {
        await categoryService.createCategory(formData)
        toast.success("Category created successfully")
      }
      setShowForm(false)
      setEditingCategory(null)
      setFormData({ name: "", description: "" })
      fetchCategories()
    } catch (error) {
      // Error handled by service
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await categoryService.deleteCategory(category.id)
        toast.success("Category deleted successfully")
        fetchCategories()
      } catch (error) {
        // Error handled by service
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage book categories in the library system</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCategory(null)
                      setFormData({ name: "", description: "" })
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

      {/* Categories List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading size="lg" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Tag className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">Books: {category.books_count || 0}</p>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(category)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {category.description && <p className="mt-3 text-sm text-gray-600">{category.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
