
import { useState, useEffect } from "react"
import MainLayout from "../../components/Layout/MainLayout"
import {
  Paper,
  Typography,
  Grid,
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
  Card,
  CardContent,
} from "@mui/material"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

const Payroll = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [payrollHistory, setPayrollHistory] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    fetchPayrollData()
  }, [user])

  const fetchPayrollData = async () => {
    try {
      setLoading(true)

      // Get employee ID from user
      const employeeId = user.employeeId

      if (!employeeId) {
        setError("Employee ID not found. Please contact HR.")
        return
      }

      // Fetch payroll history
      const response = await api.get(`/payroll/employee/${employeeId}`)
      setPayrollHistory(response.data)
    } catch (error) {
      console.error("Error fetching payroll data:", error)
      setError("Failed to load payroll data. Please try again later.")
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

  // Get the latest payroll
  const latestPayroll = payrollHistory.length > 0 ? payrollHistory[0] : null

  return (
    <MainLayout title="Payroll">
      <Grid container spacing={3}>
        {/* Latest Payroll Summary */}
        {latestPayroll && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest Payroll - {getMonthName(latestPayroll.month)} {latestPayroll.year}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Base Salary
                    </Typography>
                    <Typography variant="h6">{formatCurrency(latestPayroll.baseSalary)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Working Days
                    </Typography>
                    <Typography variant="h6">
                      {latestPayroll.presentDays} / {latestPayroll.totalWorkingDays}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Leave Days
                    </Typography>
                    <Typography variant="h6">{latestPayroll.leaveDays}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Net Salary
                    </Typography>
                    <Typography variant="h6">{formatCurrency(latestPayroll.netSalary)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Payroll History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payroll History
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Base Salary</TableCell>
                    <TableCell>Working Days</TableCell>
                    <TableCell>Present Days</TableCell>
                    <TableCell>Leave Days</TableCell>
                    <TableCell>Net Salary</TableCell>
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
                  ) : payrollHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No payroll records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    payrollHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payroll) => (
                      <TableRow key={payroll._id}>
                        <TableCell>{getMonthName(payroll.month)}</TableCell>
                        <TableCell>{payroll.year}</TableCell>
                        <TableCell>{formatCurrency(payroll.baseSalary)}</TableCell>
                        <TableCell>{payroll.totalWorkingDays}</TableCell>
                        <TableCell>{payroll.presentDays}</TableCell>
                        <TableCell>{payroll.leaveDays}</TableCell>
                        <TableCell>{formatCurrency(payroll.netSalary)}</TableCell>
                        <TableCell>{getStatusChip(payroll.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={payrollHistory.length}
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

export default Payroll

