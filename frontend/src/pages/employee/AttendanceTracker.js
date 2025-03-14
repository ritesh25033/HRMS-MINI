

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  TextField, // Added TextField import
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import axios from "axios"
import { API_URL } from "../../config"
import AuthContext from "../../context/AuthContext"

const AttendanceTracker = () => {
  const { user } = useContext(AuthContext)
  const [employee, setEmployee] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkedOut, setCheckedOut] = useState(false)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // First get the employee ID associated with the user
        const { data: userData } = await axios.get(`${API_URL}/api/auth/profile`)

        if (userData.employeeId) {
          // Fetch employee details
          const { data: employeeData } = await axios.get(`${API_URL}/api/employees/${userData.employeeId}`)
          setEmployee(employeeData)

          // Check today's attendance status
          checkTodayAttendance(userData.employeeId)

          // Fetch attendance history for the selected month
          fetchAttendanceHistory(userData.employeeId, selectedMonth)
        } else {
          setError("Employee profile not found")
        }
      } catch (error) {
        console.error("Error fetching employee data:", error)
        setError("Failed to fetch employee data")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [user])

  const checkTodayAttendance = async (employeeId) => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const { data } = await axios.get(`${API_URL}/api/attendance/${employeeId}?startDate=${today}&endDate=${today}`)

      if (data.length > 0) {
        setCheckedIn(!!data[0].checkIn)
        setCheckedOut(!!data[0].checkOut)
      }
    } catch (error) {
      console.error("Error checking today's attendance:", error)
    }
  }

  const fetchAttendanceHistory = async (employeeId, date) => {
    try {
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
      const endDate = new Date(year, month, 0).toISOString().split("T")[0]

      const { data } = await axios.get(
        `${API_URL}/api/attendance/${employeeId}?startDate=${startDate}&endDate=${endDate}`,
      )
      setAttendance(data)
    } catch (error) {
      console.error("Error fetching attendance history:", error)
      setError("Failed to fetch attendance history")
    }
  }

  const handleCheckIn = async () => {
    try {
      setError("")
      setSuccess("")

      await axios.post(`${API_URL}/api/attendance/check-in`, {
        employeeId: employee._id,
      })

      setCheckedIn(true)
      setSuccess("Successfully checked in")

      // Refresh attendance history
      fetchAttendanceHistory(employee._id, selectedMonth)
    } catch (error) {
      console.error("Error checking in:", error)
      setError(error.response?.data?.message || "Failed to check in")
    }
  }

  const handleCheckOut = async () => {
    try {
      setError("")
      setSuccess("")

      await axios.post(`${API_URL}/api/attendance/check-out`, {
        employeeId: employee._id,
      })

      setCheckedOut(true)
      setSuccess("Successfully checked out")

      // Refresh attendance history
      fetchAttendanceHistory(employee._id, selectedMonth)
    } catch (error) {
      console.error("Error checking out:", error)
      setError(error.response?.data?.message || "Failed to check out")
    }
  }

  const handleMonthChange = (date) => {
    setSelectedMonth(date)
    if (employee) {
      fetchAttendanceHistory(employee._id, date)
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "present":
        return <Chip label="Present" color="success" size="small" />
      case "absent":
        return <Chip label="Absent" color="error" size="small" />
      case "half-day":
        return <Chip label="Half Day" color="warning" size="small" />
      default:
        return <Chip label="Unknown" size="small" />
    }
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (!employee) {
    return <Typography color="error">Employee profile not found</Typography>
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Attendance Tracker
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Today's Attendance
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleCheckIn} disabled={checkedIn}>
                  Check In
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCheckOut}
                  disabled={!checkedIn || checkedOut}
                >
                  Check Out
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6">Attendance History</Typography>
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Check In</TableCell>
                      <TableCell>Check Out</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No attendance records found for this month
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendance.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{formatTime(record.checkIn)}</TableCell>
                          <TableCell>{formatTime(record.checkOut)}</TableCell>
                          <TableCell>{getStatusChip(record.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  )
}

export default AttendanceTracker

