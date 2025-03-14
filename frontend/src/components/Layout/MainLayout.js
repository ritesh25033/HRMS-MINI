// 'use client';

// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import {
//   AppBar,
//   Box,
//   CssBaseline,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Typography,
//   Avatar,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   EventNote as EventNoteIcon,
//   AssignmentInd as AssignmentIndIcon,
//   Payment as PaymentIcon,
//   AccountCircle as AccountCircleIcon,
//   Logout as LogoutIcon,
// } from '@mui/icons-material';

// const drawerWidth = 240;

// const MainLayout = ({ children, title }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   // Define menu items based on user role
//   const menuItems =
//     user?.role === 'hr'
//       ? [
//           { text: 'Dashboard', icon: <DashboardIcon />, path: '/hr/dashboard' },
//           { text: 'Employees', icon: <PeopleIcon />, path: '/hr/employees' },
//           {
//             text: 'Attendance',
//             icon: <EventNoteIcon />,
//             path: '/hr/attendance',
//           },
//           {
//             text: 'Leave Management',
//             icon: <AssignmentIndIcon />,
//             path: '/hr/leave',
//           },
//           { text: 'Payroll', icon: <PaymentIcon />, path: '/hr/payroll' },
//         ]
//       : [
//           {
//             text: 'Dashboard',
//             icon: <DashboardIcon />,
//             path: '/employee/dashboard',
//           },
//           {
//             text: 'Attendance',
//             icon: <EventNoteIcon />,
//             path: '/employee/attendance',
//           },
//           {
//             text: 'Leave',
//             icon: <AssignmentIndIcon />,
//             path: '/employee/leave',
//           },
//           { text: 'Payroll', icon: <PaymentIcon />, path: '/employee/payroll' },
//         ];

//   const drawer = (
//     <div>
//       <Toolbar>
//         <Typography variant='h6' noWrap component='div'>
//           HRMS System
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         {menuItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton
//               selected={location.pathname === item.path}
//               onClick={() => navigate(item.path)}
//             >
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position='fixed'
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color='inherit'
//             aria-label='open drawer'
//             edge='start'
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
//             {title}
//           </Typography>
//           <IconButton
//             size='large'
//             edge='end'
//             aria-label='account of current user'
//             aria-controls='menu-appbar'
//             aria-haspopup='true'
//             onClick={handleProfileMenuOpen}
//             color='inherit'
//           >
//             <Avatar sx={{ width: 32, height: 32 }}>
//               {user?.name?.charAt(0) || 'U'}
//             </Avatar>
//           </IconButton>
//           <Menu
//             id='menu-appbar'
//             anchorEl={anchorEl}
//             anchorOrigin={{
//               vertical: 'bottom',
//               horizontal: 'right',
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//             open={Boolean(anchorEl)}
//             onClose={handleProfileMenuClose}
//           >
//             <MenuItem
//               onClick={() => {
//                 handleProfileMenuClose();
//                 navigate(
//                   user?.role === 'hr' ? '/hr/profile' : '/employee/profile'
//                 );
//               }}
//             >
//               <ListItemIcon>
//                 <AccountCircleIcon fontSize='small' />
//               </ListItemIcon>
//               <ListItemText>Profile</ListItemText>
//             </MenuItem>
//             <MenuItem onClick={handleLogout}>
//               <ListItemIcon>
//                 <LogoutIcon fontSize='small' />
//               </ListItemIcon>
//               <ListItemText>Logout</ListItemText>
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//       <Box
//         component='nav'
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//         aria-label='mailbox folders'
//       >
//         <Drawer
//           variant='temporary'
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': {
//               boxSizing: 'border-box',
//               width: drawerWidth,
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant='permanent'
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': {
//               boxSizing: 'border-box',
//               width: drawerWidth,
//             },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>
//       <Box
//         component='main'
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//         }}
//       >
//         <Toolbar />
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default MainLayout;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AssignmentInd as AssignmentIndIcon,
  Payment as PaymentIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const MainLayout = ({ children, title }) => {
  const { user, logout } = useAuth() || {}; // Ensure context is available
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout && logout(); // Check if logout function exists
    navigate('/login');
  };

  // Sidebar menu items
  const menuItems =
    user?.role === 'hr'
      ? [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/hr/dashboard' },
          { text: 'Employees', icon: <PeopleIcon />, path: '/hr/employees' },
          {
            text: 'Attendance',
            icon: <EventNoteIcon />,
            path: '/hr/attendance',
          },
          {
            text: 'Leave Management',
            icon: <AssignmentIndIcon />,
            path: '/hr/leave',
          },
          { text: 'Payroll', icon: <PaymentIcon />, path: '/hr/payroll' },
        ]
      : [
          {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/employee/dashboard',
          },
          {
            text: 'Attendance',
            icon: <EventNoteIcon />,
            path: '/employee/attendance',
          },
          {
            text: 'Leave',
            icon: <AssignmentIndIcon />,
            path: '/employee/leave',
          },
          { text: 'Payroll', icon: <PaymentIcon />, path: '/employee/payroll' },
        ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant='h6' noWrap component='div'>
          HRMS System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton
            size='large'
            edge='end'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleProfileMenuOpen}
            color='inherit'
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                navigate(
                  user?.role === 'hr' ? '/hr/profile' : '/employee/profile'
                );
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='sidebar menu'
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better performance on mobile
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
