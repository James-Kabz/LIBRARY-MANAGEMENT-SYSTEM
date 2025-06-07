import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../stores/authStore"
import { Loading } from "../ui/Loading"

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some((role) => user.roles?.includes(role))

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
