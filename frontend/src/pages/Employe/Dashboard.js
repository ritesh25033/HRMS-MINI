

import React, { useState, useEffect } from "react"
import MainLayout from "../../components/Layout/MainLayout"
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

const Dashboard = () => {
  console.log("EmployeeDashboard Rendered");
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [employeeData, setEmployeeData] = useState(null)
  const [attendanceData, setAttendanceData] = useState(null)
  const [leaveData, setLeaveData] = useState([])
  const [payrollData, setPayrollData] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        if (!user || !user.employeeId) {
          setError("Employee ID not found. Please contact HR.")
          return
        }

        // Fetch employee details
        const employeeResponse = await api.get(`/employees/${user.employeeId}`)
        setEmployeeData(employeeResponse.data)

        // Fetch today's attendance
        const today = new Date().toISOString().split("T")[0]
        const attendanceResponse = await api.get(`/attendance/${user.employeeId}`)
        const todayAttendance = attendanceResponse.data.find(
          (record) => new Date(record.date).toISOString().split("T")[0] === today,
        )
        setAttendanceData(todayAttendance || null)

        // Fetch recent leave requests
        const leaveResponse = await api.get(`/leave/employee/${user.employeeId}`)
        setLeaveData(leaveResponse.data.slice(0, 5)) // Get only the 5 most recent

        // Fetch latest payroll
        const payrollResponse = await api.get(`/payroll/employee/${user.employeeId}`)
        setPayrollData(payrollResponse.data.length > 0 ? payrollResponse.data[0] : null)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (loading) {
    return (
      <MainLayout title="Employee Dashboard">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout title="Employee Dashboard">
        <Box sx={{ mt: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </MainLayout>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString()
  }

  const getLeaveStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip label="Pending" color="warning" size="small" />
      case "approved":
        return <Chip label="Approved" color="success" size="small" />
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[monthNumber - 1]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <MainLayout title="Employee Dashboard">
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome, {user.name}!
              </Typography>
              <Typography variant="body1">Employee ID: {user.employeeId}</Typography>
              <Typography variant="body1">Department: {employeeData?.department}</Typography>
              <Typography variant="body1">Designation: {employeeData?.designation}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Attendance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Attendance
              </Typography>
              {attendanceData ? (
                <Box>
                  <Typography variant="body1">
                    Status: {attendanceData.status === "present" ? "Present" : attendanceData.status}
                  </Typography>
                  <Typography variant="body1">Check-in: {formatTime(attendanceData.checkIn?.time)}</Typography>
                  <Typography variant="body1">Check-out: {formatTime(attendanceData.checkOut?.time)}</Typography>
                  {attendanceData.workingHours > 0 && (
                    <Typography variant="body1">
                      Working Hours: {attendanceData.workingHours.toFixed(2)} hours
                    </Typography>
                  )}
                </Box>
              ) : (
                <Alert severity="info">You haven't checked in today.</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Payroll */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Latest Payroll
              </Typography>
              {payrollData ? (
                <Box>
                  <Typography variant="body1">
                    Month: {getMonthName(payrollData.month)} {payrollData.year}
                  </Typography>
                  <Typography variant="body1">Base Salary: {formatCurrency(payrollData.baseSalary)}</Typography>
                  <Typography variant="body1">Net Salary: {formatCurrency(payrollData.netSalary)}</Typography>
                  <Typography variant="body1">Status: {payrollData.status}</Typography>
                </Box>
              ) : (
                <Alert severity="info">No payroll records found.</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Leave Requests */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Leave Requests
              </Typography>
              {leaveData.length > 0 ? (
                <List>
                  {leaveData.map((leave, index) => (
                    <React.Fragment key={leave._id}>
                      <ListItem>
                        <ListItemText
                          primary={`${leave.leaveType} Leave (${formatDate(leave.startDate)} to ${formatDate(leave.endDate)})`}
                          secondary={leave.reason}
                        />
                        {getLeaveStatusChip(leave.status)}
                      </ListItem>
                      {index < leaveData.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="info">No leave requests found.</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  )
}

export default Dashboard

