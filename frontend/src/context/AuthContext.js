// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios
//         .get("http://localhost:5000/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => setUser(res.data))
//         .catch(() => localStorage.removeItem("token"));
//     }
//     setLoading(false);
//   }, []);

//   const login = (token) => {
//     localStorage.setItem("token", token);
//     axios
//       .get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setUser(res.data));
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;




import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

          const { data } = await axios.get(`${API_URL}/api/auth/profile`)
          setUser(data)
        }
      } catch (error) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      }

      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  // Login user
  const login = async (email, password) => {
    try {
      setError(null)
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password })

      localStorage.setItem("token", data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

      setUser(data)
      return data
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred")
      throw error
    }
  }

  // Register user
  const register = async (name, email, password, role = "employee") => {
    try {
      setError(null)
      const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role })

      localStorage.setItem("token", data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

      setUser(data)
      return data
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred")
      throw error
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "hr",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

