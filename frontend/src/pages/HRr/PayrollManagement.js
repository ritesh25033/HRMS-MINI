

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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  MenuItem,
} from "@mui/material"
import api from "../../services/api"

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: new Date().getFullYear(),
  })
  const [formErrors, setFormErrors] = useState({})
  const [generateLoading, setGenerateLoading] = useState(false)
  const [updateStatusDialog, setUpdateStatusDialog] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false)

  useEffect(() => {
    fetchPayrolls()
    fetchEmployees()
  }, [])

  const fetchPayrolls = async () => {
    try {
      setLoading(true)
      // This is a mock endpoint - in a real app, you would have an endpoint to get all payrolls
      const employeesResponse = await api.get("/employees")

      // For each employee, get their payroll records
      const payrollPromises = employeesResponse.data.map((employee) => api.get(`/payroll/employee/${employee._id}`))

      const payrollResponses = await Promise.all(payrollPromises)

      // Flatten the array of payroll arrays
      const allPayrolls = payrollResponses.flatMap((response) => response.data)

      // Sort by date (newest first)
      allPayrolls.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })

      setPayrolls(allPayrolls)
    } catch (error) {
      console.error("Error fetching payrolls:", error)
      setError("Failed to load payroll data. Please try again later.")
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

  const handleOpenGenerateDialog = () => {
    setFormData({
      employeeId: "",
      month: "",
      year: new Date().getFullYear(),
    })
    setFormErrors({})
    setOpenDialog(true)
  }

  const handleCloseGenerateDialog = () => {
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
    if (!formData.employeeId) errors.employeeId = "Employee is required"
    if (!formData.month) errors.month = "Month is required"
    if (!formData.year) errors.year = "Year is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGeneratePayroll = async () => {
    if (!validateForm()) return

    try {
      setGenerateLoading(true)
      await api.post("/payroll/generate", formData)
      fetchPayrolls()
      handleCloseGenerateDialog()
    } catch (error) {
      console.error("Error generating payroll:", error)
      setError(error.response?.data?.message || "Failed to generate payroll. Please try again.")
    } finally {
      setGenerateLoading(false)
    }
  }

  const handleOpenUpdateStatusDialog = (payroll) => {
    setSelectedPayroll(payroll)
    setUpdateStatusDialog(true)
  }

  const handleCloseUpdateStatusDialog = () => {
    setUpdateStatusDialog(false)
    setSelectedPayroll(null)
  }

  const handleUpdatePayrollStatus = async (status) => {
    try {
      setUpdateStatusLoading(true)
      await api.patch(`/payroll/${selectedPayroll._id}`, { status })
      fetchPayrolls()
      handleCloseUpdateStatusDialog()
    } catch (error) {
      console.error("Error updating payroll status:", error)
      setError("Failed to update payroll status. Please try again.")
    } finally {
      setUpdateStatusLoading(false)
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

  const getStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip label="Pending" color="warning" size="small" />
      case "processed":
        return <Chip label="Processed" color="info" size="small" />
      case "paid":
        return <Chip label="Paid" color="success" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  // Find employee name by ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp._id === employeeId)
    return employee ? employee.name : "Unknown"
  }

  return (
    <MainLayout title="Payroll Management">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h1">
            Payroll Management
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenGenerateDialog}>
            Generate Payroll
          </Button>
        </Box>

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
                  <TableCell>Month/Year</TableCell>
                  <TableCell>Base Salary</TableCell>
                  <TableCell>Working Days</TableCell>
                  <TableCell>Present Days</TableCell>
                  <TableCell>Leave Days</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : payrolls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No payroll records found
                    </TableCell>
                  </TableRow>
                ) : (
                  payrolls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payroll) => (
                    <TableRow hover key={payroll._id}>
                      <TableCell>{getEmployeeName(payroll.employeeId)}</TableCell>
                      <TableCell>{`${getMonthName(payroll.month)} ${payroll.year}`}</TableCell>
                      <TableCell>{formatCurrency(payroll.baseSalary)}</TableCell>
                      <TableCell>{payroll.totalWorkingDays}</TableCell>
                      <TableCell>{payroll.presentDays}</TableCell>
                      <TableCell>{payroll.leaveDays}</TableCell>
                      <TableCell>{formatCurrency(payroll.netSalary)}</TableCell>
                      <TableCell>{getStatusChip(payroll.status)}</TableCell>
                      <TableCell>
                        {payroll.status !== "paid" && (
                          <Button variant="outlined" size="small" onClick={() => handleOpenUpdateStatusDialog(payroll)}>
                            Update Status
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={payrolls.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Generate Payroll Dialog */}
      <Dialog open={openDialog} onClose={handleCloseGenerateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Payroll</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Employee"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                error={!!formErrors.employeeId}
                helperText={formErrors.employeeId}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                error={!!formErrors.month}
                helperText={formErrors.month}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <MenuItem key={month} value={month}>
                    {getMonthName(month)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                error={!!formErrors.year}
                helperText={formErrors.year}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenerateDialog}>Cancel</Button>
          <Button onClick={handleGeneratePayroll} variant="contained" color="primary" disabled={generateLoading}>
            {generateLoading ? <CircularProgress size={24} /> : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialog} onClose={handleCloseUpdateStatusDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Payroll Status</DialogTitle>
        <DialogContent>
          {selectedPayroll && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Employee:</strong> {getEmployeeName(selectedPayroll.employeeId)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Month/Year:</strong> {getMonthName(selectedPayroll.month)} {selectedPayroll.year}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Net Salary:</strong> {formatCurrency(selectedPayroll.netSalary)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Current Status:</strong> {selectedPayroll.status}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateStatusDialog}>Cancel</Button>
          {selectedPayroll?.status === "pending" && (
            <Button
              onClick={() => handleUpdatePayrollStatus("processed")}
              variant="contained"
              color="primary"
              disabled={updateStatusLoading}
            >
              {updateStatusLoading ? <CircularProgress size={24} /> : "Mark as Processed"}
            </Button>
          )}
          {selectedPayroll?.status !== "paid" && (
            <Button
              onClick={() => handleUpdatePayrollStatus("paid")}
              variant="contained"
              color="success"
              disabled={updateStatusLoading}
            >
              {updateStatusLoading ? <CircularProgress size={24} /> : "Mark as Paid"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}

export default PayrollManagement

