

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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material"
import api from "../../services/api"

const LeaveManagement = () => {
  const [pendingLeaves, setPendingLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [comments, setComments] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPendingLeaves()
  }, [])

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true)
      const response = await api.get("/leave/pending")
      setPendingLeaves(response.data)
    } catch (error) {
      console.error("Error fetching pending leaves:", error)
      setError("Failed to load pending leave requests. Please try again later.")
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

  const handleOpenDialog = (leave, status) => {
    setSelectedLeave({ ...leave, status })
    setComments("")
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedLeave(null)
  }

  const handleUpdateLeaveStatus = async () => {
    try {
      setActionLoading(true)
      await api.patch(`/leave/${selectedLeave._id}`, {
        status: selectedLeave.status,
        comments: comments,
      })
      fetchPendingLeaves()
      handleCloseDialog()
    } catch (error) {
      console.error("Error updating leave status:", error)
      setError("Failed to update leave status. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Pending Leave Requests
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
                  <TableCell>Leave Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : pendingLeaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No pending leave requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingLeaves.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leave) => (
                    <TableRow hover key={leave._id}>
                      <TableCell>{leave.employeeId.name}</TableCell>
                      <TableCell>{leave.employeeId.department}</TableCell>
                      <TableCell>{getLeaveTypeLabel(leave.leaveType)}</TableCell>
                      <TableCell>{formatDate(leave.startDate)}</TableCell>
                      <TableCell>{formatDate(leave.endDate)}</TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleOpenDialog(leave, "approved")}
                          sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleOpenDialog(leave, "rejected")}
                        >
                          Reject
                        </Button>
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
            count={pendingLeaves.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Approval/Rejection Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedLeave?.status === "approved" ? "Approve Leave Request" : "Reject Leave Request"}
        </DialogTitle>
        <DialogContent>
          {selectedLeave && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Employee:</strong> {selectedLeave.employeeId.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Leave Type:</strong> {getLeaveTypeLabel(selectedLeave.leaveType)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Duration:</strong> {formatDate(selectedLeave.startDate)} to{" "}
                  {formatDate(selectedLeave.endDate)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Reason:</strong> {selectedLeave.reason}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  multiline
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={`Add comments for ${selectedLeave.status === "approved" ? "approval" : "rejection"}`}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateLeaveStatus}
            variant="contained"
            color={selectedLeave?.status === "approved" ? "success" : "error"}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={24} />
            ) : selectedLeave?.status === "approved" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}

export default LeaveManagement

