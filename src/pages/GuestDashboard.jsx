"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchBookingsByUser } from "@/services/bookingService"

const GuestDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadUserBookings()
  }, [])

  const loadUserBookings = async () => {
    setLoading(true)
    setError("")

    const userId = localStorage.getItem("userId")

    if (userId) {
      const result = await fetchBookingsByUser(userId)

      if (result.success) {
        setBookings(result.bookings)
      } else {
        setError(result.message)
      }
    } else {
      setError("User not found. Please log in again.")
    }

    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    window.location.href = "/"
  }

  const getStatusBadgeVariant = (status) => {
    return status === "confirmed" ? "default" : "secondary"
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Guest Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>Manage your bookings and explore our services</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/booking">
              <Button>Make New Booking</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Current Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading your bookings...</div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">You don't have any bookings yet.</div>
                <Link to="/booking">
                  <Button>Make Your First Booking</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.roomType}</h3>
                        <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                        <p className="text-sm text-gray-600">Room: {booking.roomNumber}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                        <div className="text-lg font-semibold mt-1">{formatCurrency(booking.totalAmount)}</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <div>
                          <div className="font-medium">Check-in</div>
                          <div>{booking.checkIn}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🕒</span>
                        <div>
                          <div className="font-medium">Check-out</div>
                          <div>{booking.checkOut}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👥</span>
                        <div>
                          <div className="font-medium">Guests</div>
                          <div>
                            {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🌙</span>
                        <div>
                          <div className="font-medium">Nights</div>
                          <div>
                            {booking.nights} night{booking.nights > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                        <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {booking.status === "confirmed" && (
                        <Button size="sm" variant="outline">
                          Modify Booking
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Retry Button */}
            {error && !loading && (
              <div className="text-center mt-4">
                <Button onClick={loadUserBookings} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hotel Services */}
        <Card>
          <CardHeader>
            <CardTitle>Hotel Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <div className="text-center">
                  <div>Room Service</div>
                  <div className="text-xs text-gray-500">24/7 Available</div>
                </div>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <div className="text-center">
                  <div>Spa Booking</div>
                  <div className="text-xs text-gray-500">Relax & Rejuvenate</div>
                </div>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <div className="text-center">
                  <div>Concierge</div>
                  <div className="text-xs text-gray-500">Local Assistance</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GuestDashboard
