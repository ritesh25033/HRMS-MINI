
import { useState, useEffect } from "react"
import MainLayout from "../../components/Layout/MainLayout"
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material"
import api from "../../services/api"

const AttendanceManagement = () => {
  const [todayAttendance, setTodayAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    fetchTodayAttendance()
    fetchEmployees()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true)
      const response = await api.get("/attendance/today/all")
      setTodayAttendance(response.data)
    } catch (error) {
      console.error("Error fetching today's attendance:", error)
      setError("Failed to load attendance data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees")
      setEmployees(response.data)
    } catch (error) {
      console.error("Error fetching employees:", error)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString()
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

  const getCheckInStatusChip = (status) => {
    if (status === "late") {
      return <Chip label="Late" color="warning" size="small" />
    }
    return <Chip label="On Time" color="success" size="small" />
  }

  const getCheckOutStatusChip = (status) => {
    switch (status) {
      case "early":
        return <Chip label="Early" color="warning" size="small" />
      case "overtime":
        return <Chip label="Overtime" color="info" size="small" />
      default:
        return <Chip label="On Time" color="success" size="small" />
    }
  }

  return (
    <MainLayout title="Attendance Management">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Today's Attendance
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Check-in Time</TableCell>
                  <TableCell>Check-in Status</TableCell>
                  <TableCell>Check-out Time</TableCell>
                  <TableCell>Check-out Status</TableCell>
                  <TableCell>Working Hours</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : todayAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No attendance records found for today
                    </TableCell>
                  </TableRow>
                ) : (
                  todayAttendance.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                    <TableRow hover key={record._id}>
                      <TableCell>{record.employeeId.name}</TableCell>
                      <TableCell>{record.employeeId.department}</TableCell>
                      <TableCell>{formatTime(record.checkIn?.time)}</TableCell>
                      <TableCell>
                        {record.checkIn?.time ? getCheckInStatusChip(record.checkIn.status) : "N/A"}
                      </TableCell>
                      <TableCell>{formatTime(record.checkOut?.time)}</TableCell>
                      <TableCell>
                        {record.checkOut?.time ? getCheckOutStatusChip(record.checkOut.status) : "N/A"}
                      </TableCell>
                      <TableCell>{record.workingHours ? `${record.workingHours.toFixed(2)} hours` : "N/A"}</TableCell>
                      <TableCell>{getStatusChip(record.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={todayAttendance.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </MainLayout>
  )
}

export default AttendanceManagement

