

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { CircularProgress, Box } from "@mui/material"
import AuthContext from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return isAdmin ? children : <Navigate to="/dashboard" />
}

export default AdminRoute

