

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../../components/Layout/MainLayout"
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import api from "../../services/api"

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadhaar: "",
    pan: "",
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    baseSalary: "",
    department: "",
    designation: "",
  })
  const [formErrors, setFormErrors] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await api.get("/employees")
      setEmployees(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching employees:", error)
      setError("Failed to load employees. Please try again later.")
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

  const handleOpenAddDialog = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      aadhaar: "",
      pan: "",
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        bankName: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      baseSalary: "",
      department: "",
      designation: "",
    })
    setFormErrors({})
    setOpenAddDialog(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
  }

  const handleOpenDeleteDialog = (employee) => {
    setSelectedEmployee(employee)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedEmployee(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name) errors.name = "Name is required"
    if (!formData.email) errors.email = "Email is required"
    if (!formData.phone) errors.phone = "Phone is required"
    if (!formData.address) errors.address = "Address is required"
    if (!formData.aadhaar) errors.aadhaar = "Aadhaar is required"
    if (!formData.pan) errors.pan = "PAN is required"
    if (!formData.bankDetails.accountNumber) errors["bankDetails.accountNumber"] = "Account number is required"
    if (!formData.bankDetails.ifscCode) errors["bankDetails.ifscCode"] = "IFSC code is required"
    if (!formData.bankDetails.bankName) errors["bankDetails.bankName"] = "Bank name is required"
    if (!formData.emergencyContact.name) errors["emergencyContact.name"] = "Emergency contact name is required"
    if (!formData.emergencyContact.relationship) errors["emergencyContact.relationship"] = "Relationship is required"
    if (!formData.emergencyContact.phone) errors["emergencyContact.phone"] = "Emergency contact phone is required"
    if (!formData.baseSalary) errors.baseSalary = "Base salary is required"
    if (!formData.department) errors.department = "Department is required"
    if (!formData.designation) errors.designation = "Designation is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddEmployee = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      await api.post("/employees", formData)
      fetchEmployees()
      handleCloseAddDialog()
    } catch (error) {
      console.error("Error adding employee:", error)
      setError("Failed to add employee. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmployee = async () => {
    try {
      setLoading(true)
      await api.delete(`/employees/${selectedEmployee._id}`)
      fetchEmployees()
      handleCloseDeleteDialog()
    } catch (error) {
      console.error("Error deleting employee:", error)
      setError("Failed to delete employee. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewEmployee = (id) => {
    navigate(`/hr/employees/${id}`)
  }

  const handleEditEmployee = (id) => {
    navigate(`/hr/employees/${id}`)
  }

  return (
    <MainLayout title="Employee Management">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h1">
            Employees
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
            Add Employee
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton color="primary" onClick={() => handleViewEmployee(employee._id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleEditEmployee(employee._id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(employee)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={employees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* Add Employee Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Aadhaar Number"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleInputChange}
                error={!!formErrors.aadhaar}
                helperText={formErrors.aadhaar}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PAN Number"
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
                error={!!formErrors.pan}
                helperText={formErrors.pan}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Bank Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Account Number"
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleInputChange}
                error={!!formErrors["bankDetails.accountNumber"]}
                helperText={formErrors["bankDetails.accountNumber"]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="bankDetails.ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={handleInputChange}
                error={!!formErrors["bankDetails.ifscCode"]}
                helperText={formErrors["bankDetails.ifscCode"]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleInputChange}
                error={!!formErrors["bankDetails.bankName"]}
                helperText={formErrors["bankDetails.bankName"]}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Emergency Contact
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                error={!!formErrors["emergencyContact.name"]}
                helperText={formErrors["emergencyContact.name"]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Relationship"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                error={!!formErrors["emergencyContact.relationship"]}
                helperText={formErrors["emergencyContact.relationship"]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phone"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                error={!!formErrors["emergencyContact.phone"]}
                helperText={formErrors["emergencyContact.phone"]}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Base Salary"
                name="baseSalary"
                type="number"
                value={formData.baseSalary}
                onChange={handleInputChange}
                error={!!formErrors.baseSalary}
                helperText={formErrors.baseSalary}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                error={!!formErrors.department}
                helperText={formErrors.department}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                error={!!formErrors.designation}
                helperText={formErrors.designation}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddEmployee} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Add Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete employee "{selectedEmployee?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteEmployee} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}

export default EmployeeManagement

