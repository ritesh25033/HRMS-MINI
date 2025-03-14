
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { CircularProgress, Box } from "@mui/material"
import AuthContext from "../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute

