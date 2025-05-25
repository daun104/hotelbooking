import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  const userType = localStorage.getItem("userType")

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
