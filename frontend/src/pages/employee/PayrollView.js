

import { useState, useEffect, useContext } from "react"
import {
  Box,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material"
import axios from "axios"
import { API_URL } from "../../config"
import AuthContext from "../../context/AuthContext"

const PayrollView = () => {
  const { user } = useContext(AuthContext)
  const [employee, setEmployee] = useState(null)
  const [payrolls, setPayrolls] = useState([])
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // First get the employee ID associated with the user
        const { data: userData } = await axios.get(`${API_URL}/api/auth/profile`)

        if (userData.employeeId) {
          // Fetch employee details
          const { data: employeeData } = await axios.get(`${API_URL}/api/employees/${userData.employeeId}`)
          setEmployee(employeeData)

          // Fetch payroll history
          const { data: payrollData } = await axios.get(`${API_URL}/api/payroll/${userData.employeeId}`)
          setPayrolls(payrollData)

          if (payrollData.length > 0) {
            setSelectedPayroll(payrollData[0])
          }
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

  const handlePayrollSelect = (id) => {
    const payroll = payrolls.find((p) => p._id === id)
    setSelectedPayroll(payroll)
  }

  const handleYearChange = (e) => {
    setYear(e.target.value)
    // Filter payrolls by year (this would be better done on the server)
    const filteredPayrolls = payrolls.filter((p) => p.year === e.target.value)
    if (filteredPayrolls.length > 0) {
      setSelectedPayroll(filteredPayrolls[0])
    } else {
      setSelectedPayroll(null)
    }
  }

  const getMonthName = (month) => {
    const monthNames = [
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
    return monthNames[month - 1]
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "processed":
        return <Chip label="Processed" color="success" size="small" />
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Payroll
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">Payroll History</Typography>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select value={year} onChange={handleYearChange} label="Year">
                  {Array.from(new Set(payrolls.map((p) => p.year))).map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Net Salary</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payrolls.filter((p) => p.year === year).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No payroll records found for this year
                      </TableCell>
                    </TableRow>
                  ) : (
                    payrolls
                      .filter((p) => p.year === year)
                      .sort((a, b) => b.month - a.month)
                      .map((payroll) => (
                        <TableRow
                          key={payroll._id}
                          hover
                          onClick={() => handlePayrollSelect(payroll._id)}
                          selected={selectedPayroll?._id === payroll._id}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{getMonthName(payroll.month)}</TableCell>
                          <TableCell>{payroll.year}</TableCell>
                          <TableCell>₹{payroll.netSalary.toFixed(2)}</TableCell>
                          <TableCell>{getStatusChip(payroll.status)}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {selectedPayroll && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payslip - {getMonthName(selectedPayroll.month)} {selectedPayroll.year}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Employee Details
                      </Typography>
                      <Typography variant="body2">
                        <strong>Name:</strong> {employee.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Department:</strong> {employee.department}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Designation:</strong> {employee.designation}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Salary Details
                      </Typography>
                      <Typography variant="body2">
                        <strong>Base Salary:</strong> ₹{selectedPayroll.baseSalary.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Net Salary:</strong> ₹{selectedPayroll.netSalary.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {selectedPayroll.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Attendance Summary
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="body2">
                            <strong>Total Days:</strong> {selectedPayroll.totalDays}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">
                            <strong>Present Days:</strong> {selectedPayroll.presentDays}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">
                            <strong>Leave Days:</strong> {selectedPayroll.leaveDays}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Salary Calculation
                      </Typography>
                      <Typography variant="body2">Base Salary: ₹{selectedPayroll.baseSalary.toFixed(2)}</Typography>
                      <Typography variant="body2">
                        Per Day: ₹{(selectedPayroll.baseSalary / selectedPayroll.totalDays).toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        Effective Working Days: {selectedPayroll.presentDays + selectedPayroll.leaveDays}
                      </Typography>
                      <Typography variant="body2">
                        Formula: (Base Salary / Total Days) * (Present Days + Leave Days)
                      </Typography>
                      <Typography variant="body2">
                        = (₹{selectedPayroll.baseSalary.toFixed(2)} / {selectedPayroll.totalDays}) *{" "}
                        {selectedPayroll.presentDays + selectedPayroll.leaveDays}
                      </Typography>
                      <Typography variant="body2">= ₹{selectedPayroll.netSalary.toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default PayrollView

