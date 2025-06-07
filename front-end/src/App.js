"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./stores/authStore"
import { Layout } from "./components/layout/Layout"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { LoginForm } from "./components/auth/LoginForm"
import { RegisterForm } from "./components/auth/RegisterForm"
import { Dashboard } from "./pages/Dashboard"
import { Books } from "./pages/Books"
import { MyReservations } from "./pages/MyReservations"
import { Loading } from "./components/ui/Loading"

function App() {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10b981",
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "#ef4444",
              },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/my-reservations" element={<MyReservations />} />

                    {/* Admin/Librarian routes */}
                    <Route
                      path="/reservations"
                      element={
                        <ProtectedRoute requiredRoles={["admin", "librarian"]}>
                          <div>Reservations Management (Coming Soon)</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <div>User Management (Coming Soon)</div>
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
