

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MainLayout from "../../components/Layout/MainLayout"
import { Box, Typography, Grid, TextField, Button, CircularProgress, Alert, Card, CardContent } from "@mui/material"
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import api from "../../services/api"

const EmployeeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    designation: "",
    baseSalary: "",
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
  })
  const [formErrors, setFormErrors] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    fetchEmployeeDetails()
  }, [id])

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/employees/${id}`)
      setEmployee(response.data)

      // Set form data from employee details
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
        department: response.data.department || "",
        designation: response.data.designation || "",
        baseSalary: response.data.baseSalary || "",
        bankDetails: {
          accountNumber: response.data.bankDetails?.accountNumber || "",
          ifscCode: response.data.bankDetails?.ifscCode || "",
          bankName: response.data.bankDetails?.bankName || "",
        },
        emergencyContact: {
          name: response.data.emergencyContact?.name || "",
          relationship: response.data.emergencyContact?.relationship || "",
          phone: response.data.emergencyContact?.phone || "",
        },
      })
    } catch (error) {
      console.error("Error fetching employee details:", error)
      setError("Failed to load employee details. Please try again later.")
    } finally {
      setLoading(false)
    }
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
    if (!formData.department) errors.department = "Department is required"
    if (!formData.designation) errors.designation = "Designation is required"
    if (!formData.baseSalary) errors.baseSalary = "Base salary is required"

    if (!formData.bankDetails.accountNumber) errors["bankDetails.accountNumber"] = "Account number is required"
    if (!formData.bankDetails.ifscCode) errors["bankDetails.ifscCode"] = "IFSC code is required"
    if (!formData.bankDetails.bankName) errors["bankDetails.bankName"] = "Bank name is required"

    if (!formData.emergencyContact.name) errors["emergencyContact.name"] = "Emergency contact name is required"
    if (!formData.emergencyContact.relationship) errors["emergencyContact.relationship"] = "Relationship is required"
    if (!formData.emergencyContact.phone) errors["emergencyContact.phone"] = "Emergency contact phone is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setUpdateLoading(true)
      await api.patch(`/employees/${id}`, formData)
      setUpdateSuccess(true)

      // Refresh employee data
      fetchEmployeeDetails()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating employee:", error)
      setError("Failed to update employee. Please try again later.")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate("/hr/employees")
  }

  if (loading) {
    return (
      <MainLayout title="Employee Details">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout title="Employee Details">
        <Box sx={{ mt: 2 }}>
          <Typography color="error">{error}</Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mt: 2 }}>
            Back to Employees
          </Button>
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Employee Details">
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
          Back to Employees
        </Button>

        <Typography variant="h5" component="h1" gutterBottom>
          Employee Details: {employee.name}
        </Typography>

        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Employee details updated successfully!
          </Alert>
        )}

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
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
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bank Details
            </Typography>
            <Grid container spacing={2}>
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
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>
            <Grid container spacing={2}>
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
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={updateLoading}>
            {updateLoading ? <CircularProgress size={24} /> : "Update Employee"}
          </Button>
        </Box>
      </Box>
    </MainLayout>
  )
}

export default EmployeeDetails

