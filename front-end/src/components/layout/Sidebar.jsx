"use client"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../stores/authStore"
import { BookOpen, Users, Calendar, PenTool, Tag, BarChart3, Home } from "lucide-react"

export const Sidebar = ({ isOpen = true, onClose }) => {
  const location = useLocation()
  const { user } = useAuthStore()

  const isLibrarian = user?.roles?.includes("librarian")
  const isAdmin = user?.roles?.includes("admin")
  const canManage = isLibrarian || isAdmin

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, show: true },
    { name: "Books", href: "/books", icon: BookOpen, show: true },
    { name: "My Reservations", href: "/my-reservations", icon: Calendar, show: !canManage },
    { name: "Reservations", href: "/reservations", icon: Calendar, show: canManage },
    { name: "Users", href: "/users", icon: Users, show: isAdmin },
    { name: "Authors", href: "/authors", icon: PenTool, show: canManage },
    { name: "Categories", href: "/categories", icon: Tag, show: canManage },
    { name: "Reports", href: "/reports", icon: BarChart3, show: canManage },
  ]

  const filteredNavigation = navigation.filter((item) => item.show)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-6 w-6",
                        isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
