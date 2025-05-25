"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchBookings, updateBookingStatus } from "@/services/bookingService"
import { fetchCleaningTasks, filterTasksByRoom, updateTaskStatus } from "@/services/cleaningService"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [bookings, setBookings] = useState([])
  const [cleaningSchedule, setCleaningSchedule] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Load bookings data when bookings tab is selected
  useEffect(() => {
    if (activeTab === "bookings") {
      loadBookings()
    }
  }, [activeTab])

  // Load cleaning data when cleaning tab is selected
  useEffect(() => {
    if (activeTab === "cleaning") {
      loadCleaningTasks()
    }
  }, [activeTab])

  const loadBookings = async () => {
    setLoading(true)
    setError("")

    const result = await fetchBookings()

    if (result.success) {
      setBookings(result.bookings)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const loadCleaningTasks = async () => {
    setLoading(true)
    setError("")

    const result = await fetchCleaningTasks()

    if (result.success) {
      setCleaningSchedule(result.tasks)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const handleConfirmBooking = async (bookingId) => {
    const result = await updateBookingStatus(bookingId, "confirmed")
    if (result.success) {
      // Reload bookings to reflect the change
      loadBookings()
    }
  }

  const handleCompleteTask = async (taskId) => {
    const result = await updateTaskStatus(taskId, "completed")
    if (result.success) {
      // Reload tasks to reflect the change
      loadCleaningTasks()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    window.location.href = "/"
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "default"
      case "pending":
      case "in-progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Filter cleaning tasks based on selected room
  const filteredTasks = filterTasksByRoom(cleaningSchedule, selectedRoom)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "bookings", label: "Booking Management" },
                { id: "cleaning", label: "Cleaning Schedule" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <span className="text-2xl">📅</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length || 24}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <span className="text-2xl">👥</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Confirmations</CardTitle>
                  <span className="text-2xl">📋</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "pending").length || 3}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rooms Cleaned</CardTitle>
                  <span className="text-2xl">✅</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cleaningSchedule.filter((t) => t.status === "completed").length}/{cleaningSchedule.length || "25"}
                  </div>
                  <p className="text-xs text-muted-foreground">Today's progress</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Manage guest bookings and confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading bookings...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Booking ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Guest Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Room</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Check-in</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Nights</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="border border-gray-300 px-4 py-2">{booking.id}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div>
                                <div className="font-medium">{booking.guestName}</div>
                                <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div>
                                <div>{booking.roomNumber}</div>
                                <div className="text-sm text-gray-500">{booking.roomType}</div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{booking.checkIn}</td>
                            <td className="border border-gray-300 px-4 py-2">{booking.nights}</td>
                            <td className="border border-gray-300 px-4 py-2">${booking.totalAmount}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                {booking.status === "pending" && (
                                  <Button size="sm" onClick={() => handleConfirmBooking(booking.id)}>
                                    Confirm
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cleaning Tab */}
          {activeTab === "cleaning" && (
            <Card>
              <CardHeader>
                <CardTitle>Cleaning Schedule</CardTitle>
                <CardDescription>Manage room and area cleaning assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Filter by room</option>
                    <option value="all">All Rooms</option>
                    <option value="101">Room 101</option>
                    <option value="102">Room 102</option>
                    <option value="lobby">Lobby</option>
                    <option value="pool">Pool Area</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading cleaning tasks...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Room/Area</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Assigned To</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Scheduled Time</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Task Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task) => (
                          <tr key={task.id}>
                            <td className="border border-gray-300 px-4 py-2">
                              <div>
                                <div className="font-medium">{task.room}</div>
                                <div className="text-sm text-gray-500">{task.roomType}</div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{task.assignedTo}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div>
                                <div>{task.scheduledTime}</div>
                                {task.completedTime && (
                                  <div className="text-sm text-green-600">Done: {task.completedTime}</div>
                                )}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Badge variant="outline">{task.taskType}</Badge>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Badge
                                variant={
                                  task.priority === "high"
                                    ? "destructive"
                                    : task.priority === "medium"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {task.priority}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                {task.status !== "completed" && (
                                  <Button size="sm" onClick={() => handleCompleteTask(task.id)}>
                                    Mark Complete
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
