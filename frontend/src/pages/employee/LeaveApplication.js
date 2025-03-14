

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Card,
  CardContent,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import axios from "axios"
import { API_URL } from "../../config"
import AuthContext from "../../context/AuthContext"

const LeaveApplication = () => {
  const { user } = useContext(AuthContext)
  const [employee, setEmployee] = useState(null)
  const [leaveBalance, setLeaveBalance] = useState({
    casualLeave: { total: 0, used: 0, remaining: 0 },
    sickLeave: { total: 0, used: 0, remaining: 0 },
    earnedLeave: { total: 0, used: 0, remaining: 0 },
  })
  const [leaveHistory, setLeaveHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: null,
    endDate: null,
    reason: "",
  })

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // First get the employee ID associated with the user
        const { data: userData } = await axios.get(`${API_URL}/api/auth/profile`)

        if (userData.employeeId) {
          // Fetch employee details
          const { data: employeeData } = await axios.get(`${API_URL}/api/employees/${userData.employeeId}`)
          setEmployee(employeeData)

          // Fetch leave balance
          const { data: balanceData } = await axios.get(`${API_URL}/api/leave/balance/${userData.employeeId}`)
          setLeaveBalance(balanceData)

          // Fetch leave history
          const { data: leaveData } = await axios.get(`${API_URL}/api/leave/${userData.employeeId}`)
          setLeaveHistory(leaveData)
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      setError("Please fill in all fields")
      return
    }

    try {
      setError("")
      setSuccess("")

      await axios.post(`${API_URL}/api/leave/apply`, {
        employeeId: employee._id,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      })

      setSuccess("Leave application submitted successfully")

      // Reset form
      setFormData({
        leaveType: "",
        startDate: null,
        endDate: null,
        reason: "",
      })

      // Refresh leave history
      const { data: leaveData } = await axios.get(`${API_URL}/api/leave/${employee._id}`)
      setLeaveHistory(leaveData)

      // Refresh leave balance
      const { data: balanceData } = await axios.get(`${API_URL}/api/leave/balance/${employee._id}`)
      setLeaveBalance(balanceData)
    } catch (error) {
      console.error("Error applying for leave:", error)
      setError(error.response?.data?.message || "Failed to apply for leave")
    }
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return <Chip label="Approved" color="success" size="small" />
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" />
      case "pending":
        return <Chip label="Pending" color="warning" size="small" />
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
          Leave Application
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Casual Leave (CL)
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {leaveBalance.casualLeave.remaining}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Used: {leaveBalance.casualLeave.used} / {leaveBalance.casualLeave.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sick Leave (SL)
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {leaveBalance.sickLeave.remaining}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Used: {leaveBalance.sickLeave.used} / {leaveBalance.sickLeave.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Earned Leave (EL)
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {leaveBalance.earnedLeave.remaining}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Used: {leaveBalance.earnedLeave.used} / {leaveBalance.earnedLeave.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Apply for Leave
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Leave Type</InputLabel>
                      <Select name="leaveType" value={formData.leaveType} onChange={handleChange} label="Leave Type">
                        <MenuItem value="CL">Casual Leave (CL)</MenuItem>
                        <MenuItem value="SL">Sick Leave (SL)</MenuItem>
                        <MenuItem value="EL">Earned Leave (EL)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(date) => handleDateChange("startDate", date)}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date"
                      value={formData.endDate}
                      onChange={(date) => handleDateChange("endDate", date)}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                      minDate={formData.startDate}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Submit Application
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Leave History
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Days</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No leave applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaveHistory.map((leave) => {
                        const startDate = new Date(leave.startDate)
                        const endDate = new Date(leave.endDate)
                        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1

                        return (
                          <TableRow key={leave._id}>
                            <TableCell>{leave.leaveType}</TableCell>
                            <TableCell>{startDate.toLocaleDateString()}</TableCell>
                            <TableCell>{endDate.toLocaleDateString()}</TableCell>
                            <TableCell>{days}</TableCell>
                            <TableCell>{leave.reason}</TableCell>
                            <TableCell>{getStatusChip(leave.status)}</TableCell>
                          </TableRow>
                        )
                      })
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

export default LeaveApplication

