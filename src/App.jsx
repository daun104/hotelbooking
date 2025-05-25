import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import BookingPage from "./pages/BookingPage"
import GuestDashboard from "./pages/GuestDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route
            path="/guest/dashboard"
            element={
              <ProtectedRoute allowedRoles={["guest"]}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
