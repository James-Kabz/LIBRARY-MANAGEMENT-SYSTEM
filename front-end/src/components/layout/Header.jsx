"use client"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import { useAuthStore } from "../../stores/authStore"
import { BookOpen, User, LogOut, Menu } from "lucide-react"

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LibraryMS</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.name}</span>
              {user?.roles && user.roles.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{user.roles[0]}</span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
