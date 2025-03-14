

import { useState, useEffect } from "react"
import MainLayout from "../../components/Layout/MainLayout"
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material"
import { AccessTime as AccessTimeIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

const Attendance = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [checkOutLoading, setCheckOutLoading] = useState(false)

  useEffect(() => {
    fetchAttendanceData()
  }, [user])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)

      // Get employee ID from user
      const employeeId = user.employeeId

      if (!employeeId) {
        setError("Employee ID not found. Please contact HR.")
        return
      }

      // Fetch attendance history
      const historyResponse = await api.get(`/attendance/${employeeId}`)
      setAttendanceHistory(historyResponse.data)

      // Check if already checked in/out today
      const today = new Date().toISOString().split("T")[0]
      const todayRecord = historyResponse.data.find(
        (record) => new Date(record.date).toISOString().split("T")[0] === today,
      )

      setTodayAttendance(todayRecord || null)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      setError("Failed to load attendance data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCheckIn = async () => {
    try {
      setCheckInLoading(true)

      const response = await api.post("/attendance/check-in", {
        employeeId: user.employeeId,
      })

      setTodayAttendance(response.data)
      fetchAttendanceData()
    } catch (error) {
      console.error("Error checking in:", error)
      setError(error.response?.data?.message || "Failed to check in. Please try again.")
    } finally {
      setCheckInLoading(false)
    }
  }

  const handleCheckOut = async () => {
    try {
      setCheckOutLoading(true)

      const response = await api.post("/attendance/check-out", {
        employeeId: user.employeeId,
      })

      setTodayAttendance(response.data)
      fetchAttendanceData()
    } catch (error) {
      console.error("Error checking out:", error)
      setError(error.response?.data?.message || "Failed to check out. Please try again.")
    } finally {
      setCheckOutLoading(false)
    }
  }

  // Check if within working hours (9:00 AM to 6:00 PM)
  const isWithinWorkingHours = () => {
    const now = new Date()
    const hours = now.getHours()
    return hours >= 9 && hours < 18
  }

  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString()
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "present":
        return <Chip label="Present" color="success" size="small" />
      case "absent":
        return <Chip label="Absent" color="error" size="small" />
      case "half-day":
        return <Chip label="Half Day" color="warning" size="small" />
      case "on-leave":
        return <Chip label="On Leave" color="info" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  return (
    <MainLayout title="Attendance">
      <Grid container spacing={3}>
        {/* Today's Attendance Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Attendance
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">Current Time: {new Date().toLocaleTimeString()}</Typography>
                  </Box>

                  {todayAttendance ? (
                    <Box>
                      <Typography variant="body1">
                        Check-in Time: {formatTime(todayAttendance.checkIn?.time)}
                        {todayAttendance.checkIn?.status === "late" && (
                          <Chip label="Late" color="warning" size="small" sx={{ ml: 1 }} />
                        )}
                      </Typography>

                      <Typography variant="body1">
                        Check-out Time: {formatTime(todayAttendance.checkOut?.time)}
                        {todayAttendance.checkOut?.status === "early" && (
                          <Chip label="Early" color="warning" size="small" sx={{ ml: 1 }} />
                        )}
                        {todayAttendance.checkOut?.status === "overtime" && (
                          <Chip label="Overtime" color="info" size="small" sx={{ ml: 1 }} />
                        )}
                      </Typography>

                      {todayAttendance.workingHours > 0 && (
                        <Typography variant="body1">
                          Working Hours: {todayAttendance.workingHours.toFixed(2)} hours
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1">You haven't checked in today.</Typography>
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}
                >
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleCheckIn}
                      disabled={
                        checkInLoading || !isWithinWorkingHours() || (todayAttendance && todayAttendance.checkIn?.time)
                      }
                      sx={{ mr: 2 }}
                    >
                      {checkInLoading ? <CircularProgress size={24} /> : "Check In"}
                    </Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CancelIcon />}
                      onClick={handleCheckOut}
                      disabled={
                        checkOutLoading ||
                        !todayAttendance ||
                        !todayAttendance.checkIn?.time ||
                        (todayAttendance && todayAttendance.checkOut?.time)
                      }
                    >
                      {checkOutLoading ? <CircularProgress size={24} /> : "Check Out"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attendance History
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Check-in Time</TableCell>
                    <TableCell>Check-out Time</TableCell>
                    <TableCell>Working Hours</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : attendanceHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>
                          {formatTime(record.checkIn?.time)}
                          {record.checkIn?.status === "late" && (
                            <Chip label="Late" color="warning" size="small" sx={{ ml: 1 }} />
                          )}
                        </TableCell>
                        <TableCell>
                          {formatTime(record.checkOut?.time)}
                          {record.checkOut?.status === "early" && (
                            <Chip label="Early" color="warning" size="small" sx={{ ml: 1 }} />
                          )}
                          {record.checkOut?.status === "overtime" && (
                            <Chip label="Overtime" color="info" size="small" sx={{ ml: 1 }} />
                          )}
                        </TableCell>
                        <TableCell>{record.workingHours ? `${record.workingHours.toFixed(2)} hours` : "N/A"}</TableCell>
                        <TableCell>{getStatusChip(record.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={attendanceHistory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  )
}

export default Attendance

