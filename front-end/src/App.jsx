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
import { Authors } from "./pages/Authors"
import { Categories } from "./pages/Categories"
import { Users } from "./pages/Users"
import { Reservations } from "./pages/Reservations"
import { Reports } from "./pages/Reports"
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
                      path="/authors"
                      element={
                        <ProtectedRoute requiredRoles={["admin", "librarian"]}>
                          <Authors />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/categories"
                      element={
                        <ProtectedRoute requiredRoles={["admin", "librarian"]}>
                          <Categories />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reservations"
                      element={
                        <ProtectedRoute requiredRoles={["admin", "librarian"]}>
                          <Reservations />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute requiredRoles={["admin", "librarian"]}>
                          <Reports />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <Users />
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
