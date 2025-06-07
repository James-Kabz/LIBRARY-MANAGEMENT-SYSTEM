"use client"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { useAuthStore } from "../../stores/authStore"
import { BookOpen } from "lucide-react"

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      navigate("/")
    } catch (error) {
      // Error handling is done in the store/service layer
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to LibraryMS</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="mt-1"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="mt-1"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">Demo accounts:</p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>Admin: admin@library.com / password</p>
            <p>Librarian: librarian@library.com / password</p>
            <p>Member: member@library.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
