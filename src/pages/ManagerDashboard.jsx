"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchWorkers, fetchPayrollData, filterWorkersByDepartment } from "@/services/workerService"

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [workers, setWorkers] = useState([])
  const [payroll, setPayroll] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Load workers data when component mounts or when staff tab is selected
  useEffect(() => {
    if (activeTab === "staff") {
      loadWorkers()
    }
  }, [activeTab])

  // Load payroll data when payroll tab is selected
  useEffect(() => {
    if (activeTab === "payroll") {
      loadPayroll()
    }
  }, [activeTab])

  const loadWorkers = async () => {
    setLoading(true)
    setError("")

    const result = await fetchWorkers()

    if (result.success) {
      setWorkers(result.workers)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const loadPayroll = async () => {
    setLoading(true)
    setError("")

    const result = await fetchPayrollData()

    if (result.success) {
      setPayroll(result.payroll)
    } else {
      setError(result.message)
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
    switch (status) {
      case "active":
      case "paid":
      case "completed":
        return "default"
      case "pending":
      case "in-progress":
        return "secondary"
      case "on-leave":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Filter workers based on selected department
  const filteredWorkers = filterWorkersByDepartment(workers, selectedDepartment)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
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
                { id: "staff", label: "Staff Management" },
                { id: "payroll", label: "Payroll" },
                { id: "bookings", label: "Bookings" },
                { id: "cleaning", label: "Cleaning" },
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
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <span className="text-2xl">💰</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                  <span className="text-2xl">👥</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workers.filter((w) => w.status === "active").length || 23}</div>
                  <p className="text-xs text-muted-foreground">
                    {workers.filter((w) => w.status === "on-leave").length || 1} on leave
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <span className="text-2xl">📅</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
                  <span className="text-2xl">💰</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${payroll.reduce((sum, p) => sum + p.total, 0).toLocaleString() || "68,500"}
                  </div>
                  <p className="text-xs text-muted-foreground">Current month</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Staff Management Tab */}
          {activeTab === "staff" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>Manage hotel staff and their schedules</CardDescription>
                  </div>
                  <Button>
                    <span className="mr-2">👤</span>
                    Add Staff
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Departments</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="front desk">Front Desk</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                  </select>
                  {loading && <div className="text-sm text-gray-500 py-2">Loading workers...</div>}
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading staff data...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Salary</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Schedule</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWorkers.map((worker) => (
                          <tr key={worker.id}>
                            <td className="border border-gray-300 px-4 py-2">
                              <div>
                                <div className="font-medium">{worker.name}</div>
                                <div className="text-sm text-gray-500">{worker.email}</div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{worker.department}</td>
                            <td className="border border-gray-300 px-4 py-2">{worker.position}</td>
                            <td className="border border-gray-300 px-4 py-2">${worker.salary.toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Badge variant="outline">🕒 {worker.schedule}</Badge>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Badge variant={getStatusBadgeVariant(worker.status)}>{worker.status}</Badge>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline">
                                  Schedule
                                </Button>
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

          {/* Payroll Tab */}
          {activeTab === "payroll" && (
            <Card>
              <CardHeader>
                <CardTitle>Payroll Management</CardTitle>
                <CardDescription>Manage employee salaries and payments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading payroll data...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Employee</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Base Salary</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Overtime</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payroll.map((payment) => (
                          <tr key={payment.employeeId}>
                            <td className="border border-gray-300 px-4 py-2">{payment.employee}</td>
                            <td className="border border-gray-300 px-4 py-2">{payment.department}</td>
                            <td className="border border-gray-300 px-4 py-2">${payment.baseSalary.toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2">${payment.overtime}</td>
                            <td className="border border-gray-300 px-4 py-2 font-medium">
                              ${payment.total.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Badge variant={getStatusBadgeVariant(payment.status)}>{payment.status}</Badge>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                {payment.status === "pending" && <Button size="sm">Process Payment</Button>}
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

          {/* Other Tabs */}
          {activeTab === "bookings" && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>All admin booking management features available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">📋 Booking management interface (same as admin)</div>
              </CardContent>
            </Card>
          )}

          {activeTab === "cleaning" && (
            <Card>
              <CardHeader>
                <CardTitle>Cleaning Schedule</CardTitle>
                <CardDescription>All admin cleaning management features available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">🧹 Cleaning schedule interface (same as admin)</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard
