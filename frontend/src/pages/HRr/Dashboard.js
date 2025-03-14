

import React, { useState, useEffect } from "react"
import MainLayout from "../../components/Layout/MainLayout"
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material"
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AssignmentInd as AssignmentIndIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material"
import api from "../../services/api"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    processedPayrolls: 0,
  })
  const [recentEmployees, setRecentEmployees] = useState([])
  const [pendingLeaves, setPendingLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch employees count
        const employeesResponse = await api.get("/employees")

        // Fetch today's attendance
        const attendanceResponse = await api.get("/attendance/today/all")

        // Fetch pending leaves
        const leavesResponse = await api.get("/leave/pending")

        // Set stats
        setStats({
          totalEmployees: employeesResponse.data.length,
          presentToday: attendanceResponse.data.length,
          pendingLeaves: leavesResponse.data.length,
          processedPayrolls: 0, // This would come from a payroll API
        })

        // Set recent employees (last 5)
        setRecentEmployees(employeesResponse.data.slice(0, 5))

        // Set pending leaves
        setPendingLeaves(leavesResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <MainLayout title="HR Dashboard">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout title="HR Dashboard">
        <Box sx={{ mt: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="HR Dashboard">
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PeopleIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Employees
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
              {stats.totalEmployees}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EventNoteIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Present Today
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
              {stats.presentToday}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AssignmentIndIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Pending Leaves
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
              {stats.pendingLeaves}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PaymentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Processed Payrolls
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
              {stats.processedPayrolls}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Employees */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Employees" />
            <CardContent>
              <List>
                {recentEmployees.length > 0 ? (
                  recentEmployees.map((employee, index) => (
                    <React.Fragment key={employee._id}>
                      <ListItem>
                        <ListItemText
                          primary={employee.name}
                          secondary={`${employee.designation} - ${employee.department}`}
                        />
                      </ListItem>
                      {index < recentEmployees.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No employees found" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Leaves */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Pending Leave Requests" />
            <CardContent>
              <List>
                {pendingLeaves.length > 0 ? (
                  pendingLeaves.map((leave, index) => (
                    <React.Fragment key={leave._id}>
                      <ListItem>
                        <ListItemText
                          primary={leave.employeeId.name}
                          secondary={`${leave.leaveType} - From: ${new Date(leave.startDate).toLocaleDateString()} To: ${new Date(leave.endDate).toLocaleDateString()}`}
                        />
                      </ListItem>
                      {index < pendingLeaves.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No pending leave requests" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  )
}

export default Dashboard

