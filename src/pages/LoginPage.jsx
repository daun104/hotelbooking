"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticateUser } from "@/services/authService"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      // Call the API service - it will find the user and return their type
      const result = await authenticateUser(email, password)

      if (result.success) {
        // Store user data
        localStorage.setItem("userType", result.user.userType)
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", result.user.name)
        localStorage.setItem("userId", result.user.id)

        if (result.user.department) {
          localStorage.setItem("userDepartment", result.user.department)
        }

        // Navigate to appropriate dashboard based on user's registered type
        switch (result.user.userType) {
          case "guest":
            navigate("/guest/dashboard")
            break
          case "admin":
            navigate("/admin/dashboard")
            break
          case "manager":
            navigate("/manager/dashboard")
            break
          default:
            navigate("/")
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your hotel dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600 mb-2">Demo Accounts:</div>
            <div className="space-y-1 text-xs text-gray-500">
              <div> Manager: dedaunan104@gmail.com</div> {/* temporary placeholder*/}
              <div> Admin: admin@hotel.com</div>
              <div> Guest: guest@example.com</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/booking" className="text-sm text-blue-600 hover:underline">
              Continue as guest without account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
