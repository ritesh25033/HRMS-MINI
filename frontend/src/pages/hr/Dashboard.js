// "use client"

// import React, { useState, useEffect } from "react"
// import { Link as RouterLink } from "react-router-dom"
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Card,
//   CardContent,
//   CardActions,
// } from "@mui/material"
// import PeopleIcon from "@mui/icons-material/People"
// import EventNoteIcon from "@mui/icons-material/EventNote"
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
// import axios from "axios"
// import { API_URL } from "../../config"

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalEmployees: 0,
//     pendingLeaves: 0,
//     processedPayrolls: 0,
//   })

//   const [recentEmployees, setRecentEmployees] = useState([])
//   const [pendingLeaves, setPendingLeaves] = useState([])

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Fetch employees
//         const { data: employees } = await axios.get(`${API_URL}/api/employees`)
//         setRecentEmployees(employees.slice(0, 5))

//         // Fetch pending leaves
//         const { data: leaves } = await axios.get(`${API_URL}/api/leave/pending`)
//         setPendingLeaves(leaves.slice(0, 5))

//         // Set stats
//         setStats({
//           totalEmployees: employees.length,
//           pendingLeaves: leaves.length,
//           processedPayrolls: 0, // This would come from a payroll API
//         })
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         HR Dashboard
//       </Typography>

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={4}>
//           <Paper
//             sx={{
//               p: 2,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               bgcolor: 'primary.light',
//               color: 'white',
//             }}
//           >
//             <PeopleIcon sx={{ fontSize: 40 }} />
//             <Typography variant="h5" component="div">
//               {stats.totalEmployees}
//             </Typography>
//             <Typography variant="body2">Total Employees</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Paper
//             sx={{
//               p: 2,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               bgcolor: 'warning.light',
//               color: 'white',
//             }}
//           >
//             <EventNoteIcon sx={{ fontSize: 40 }} />
//             <Typography variant="h5" component="div">
//               {stats.pendingLeaves}
//             </Typography>
//             <Typography variant="body2">Pending Leave Requests</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Paper
//             sx={{
//               p: 2,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               bgcolor: 'success.light',
//               color: 'white',
//             }}
//           >
//             <MonetizationOnIcon sx={{ fontSize: 40 }} />
//             <Typography variant="h5" component="div">
//               {stats.processedPayrolls}
//             </Typography>
//             <Typography variant="body2">Processed Payrolls</Typography>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Recent Employees and Pending Leaves */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Recent Employees
//               </Typography>
//               <List>
//                 {recentEmployees.length > 0 ? (
//                   recentEmployees.map((employee) => (
//                     <React.Fragment key={employee._id}>
//                       <ListItem>
//                         <ListItemText
//                           primary={employee.name}
//                           secondary={`${employee.designation} - ${employee.department}`}
//                         />
//                       </ListItem>
//                       <Divider component="li" />
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   <ListItem>
//                     <ListItemText primary="No employees found" />
//                   </ListItem>
//                 )}
//               </List>
//             </CardContent>
//             <CardActions>
//               <Button size="small" component={RouterLink} to="/hr/employees">
//                 View All Employees
//               </Button>
//             </CardActions>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Pending Leave Requests
//               </Typography>
//               <List>
//                 {pendingLeaves.length > 0 ? (
//                   pendingLeaves.map((leave) => (
//                     <React.Fragment key={leave._id}>
//                       <ListItem>
//                         <ListItemText
//                           primary={leave.employeeId.name}
//                           secondary={`${leave.leaveType} - From: ${new Date(leave.startDate).toLocaleDateString()} To: ${new Date(leave.endDate).toLocaleDateString()}`}
//                         />
//                       </ListItem>
//                       <Divider component="li" />
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   />
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   <ListItem>
//                     <ListItemText primary="No pending leave requests" />
//                   </ListItem>
//                 )}
//               </List>
//             </CardContent>
//             <CardActions>
//               <Button size="small" component={RouterLink} to="/hr/leaves">
//                 View All Leave Requests
//               </Button>
//             </CardActions>
//           </Card>
//         </Grid>
//       </Grid>
//   </Box>
//   )
// }

// export default Dashboard


import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import axios from 'axios';
import { API_URL } from '../../config';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    processedPayrolls: 0,
  });

  const [recentEmployees, setRecentEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!API_URL) {
          console.error('API_URL is undefined');
          return;
        }

        // Fetch employees
        const employeesRes = await axios.get(`${API_URL}/api/employees`);
        setRecentEmployees(employeesRes.data.slice(0, 5));

        // Fetch pending leaves
        const leavesRes = await axios.get(`${API_URL}/api/leave/pending`);
        setPendingLeaves(leavesRes.data.slice(0, 5));

        // Set stats
        setStats({
          totalEmployees: employeesRes.data.length,
          pendingLeaves: leavesRes.data.length,
          processedPayrolls: 0, // TODO: Replace with actual payroll data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        HR Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <PeopleIcon sx={{ fontSize: 40 }} />
            <Typography variant='h5'>{stats.totalEmployees}</Typography>
            <Typography variant='body2'>Total Employees</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.light',
              color: 'white',
            }}
          >
            <EventNoteIcon sx={{ fontSize: 40 }} />
            <Typography variant='h5'>{stats.pendingLeaves}</Typography>
            <Typography variant='body2'>Pending Leave Requests</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 40 }} />
            <Typography variant='h5'>{stats.processedPayrolls}</Typography>
            <Typography variant='body2'>Processed Payrolls</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Employees and Pending Leaves */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Recent Employees
              </Typography>
              <List>
                {recentEmployees.length > 0 ? (
                  recentEmployees.map((employee) => (
                    <React.Fragment key={employee._id}>
                      <ListItem>
                        <ListItemText
                          primary={employee.name}
                          secondary={`${employee.designation} - ${employee.department}`}
                        />
                      </ListItem>
                      <Divider component='li' />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary='No employees found' />
                  </ListItem>
                )}
              </List>
            </CardContent>
            <CardActions>
              <Button size='small' component={RouterLink} to='/hr/employees'>
                View All Employees
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Pending Leave Requests
              </Typography>
              <List>
                {pendingLeaves.length > 0 ? (
                  pendingLeaves.map((leave) => (
                    <React.Fragment key={leave._id}>
                      <ListItem>
                        <ListItemText
                          primary={leave.employeeId?.name || 'Unknown Employee'}
                          secondary={`${leave.leaveType} - From: ${new Date(
                            leave.startDate
                          ).toLocaleDateString()} To: ${new Date(
                            leave.endDate
                          ).toLocaleDateString()}`}
                        />
                      </ListItem>
                      <Divider component='li' />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary='No pending leave requests' />
                  </ListItem>
                )}
              </List>
            </CardContent>
            <CardActions>
              <Button size='small' component={RouterLink} to='/hr/leave'>
                View All Leave Requests
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
