

import { useState, useEffect } from "react"
import MainLayout from "../../components/Layout/MainLayout"
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

const Leave = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [leaveHistory, setLeaveHistory] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: "CL",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    fetchLeaveData()
  }, [user])

  const fetchLeaveData = async () => {
    try {
      setLoading(true)

      // Get employee ID from user
      const employeeId = user.employeeId

      if (!employeeId) {
        setError("Employee ID not found. Please contact HR.")
        return
      }

      // Fetch leave history
      const response = await api.get(`/leave/employee/${employeeId}`)
      setLeaveHistory(response.data)
    } catch (error) {
      console.error("Error fetching leave data:", error)
      setError("Failed to load leave data. Please try again later.")
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

  const handleOpenDialog = () => {
    setFormData({
      leaveType: "CL",
      startDate: "",
      endDate: "",
      reason: "",
    })
    setFormErrors({})
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.leaveType) errors.leaveType = "Leave type is required"
    if (!formData.startDate) errors.startDate = "Start date is required"
    if (!formData.endDate) errors.endDate = "End date is required"
    if (!formData.reason) errors.reason = "Reason is required"

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end < start) {
        errors.endDate = "End date cannot be before start date"
      }

      if (start < new Date().setHours(0, 0, 0, 0)) {
        errors.startDate = "Cannot apply for leave in the past"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setSubmitLoading(true)

      await api.post("/leave/apply", {
        ...formData,
        employeeId: user.employeeId,
      })

      fetchLeaveData()
      handleCloseDialog()
    } catch (error) {
      console.error("Error applying for leave:", error)
      setError(error.response?.data?.message || "Failed to apply for leave. Please try again.")
    } finally {
      setSubmitLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusChip = (status) => {
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

  const getLeaveTypeLabel = (type) => {
    switch (type) {
      case "CL":
        return "Casual Leave"
      case "SL":
        return "Sick Leave"
      case "EL":
        return "Earned Leave"
      default:
        return type
    }
  }

  return (
    <MainLayout title="Leave Management">
      <Grid container spacing={3}>
        {/* Leave Application Button */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" component="h1">
              Leave Management
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
              Apply for Leave
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Grid>

        {/* Leave History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Leave History
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : leaveHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No leave records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaveHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leave) => (
                      <TableRow key={leave._id}>
                        <TableCell>{getLeaveTypeLabel(leave.leaveType)}</TableCell>
                        <TableCell>{formatDate(leave.startDate)}</TableCell>
                        <TableCell>{formatDate(leave.endDate)}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>{getStatusChip(leave.status)}</TableCell>
                        <TableCell>{leave.comments || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={leaveHistory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Apply for Leave Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Apply for Leave</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Leave Type"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                error={!!formErrors.leaveType}
                helperText={formErrors.leaveType}
              >
                <MenuItem value="CL">Casual Leave (CL)</MenuItem>
                <MenuItem value="SL">Sick Leave (SL)</MenuItem>
                <MenuItem value="EL">Earned Leave (EL)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleInputChange}
                error={!!formErrors.startDate}
                helperText={formErrors.startDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={handleInputChange}
                error={!!formErrors.endDate}
                helperText={formErrors.endDate}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleInputChange}
                error={!!formErrors.reason}
                helperText={formErrors.reason}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitLoading}>
            {submitLoading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}

export default Leave

