// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AuthProvider from "./context/AuthContext";

// const App = () => {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </AuthProvider>
//   );
// };

// export default App;

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//     </Routes>
//   );
// };

// export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import EmployeeManagement from "./pages/Employees";
// import Attendance from "./pages/Attendance";
// import LeaveManagement from "./pages/LeaveManagement";
// import PayrollManagement from "./pages/PayrollManagement";
// import Login from "./pages/Login";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { CssBaseline } from "@mui/material";

// const App = () => {
//   return (
//     <Router>
//       <CssBaseline />
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
//         <Route path="/employees" element={<ProtectedRoute component={EmployeeManagement} />} />
//         <Route path="/attendance" element={<ProtectedRoute component={Attendance} />} />
//         <Route path="/leaves" element={<ProtectedRoute component={LeaveManagement} />} />
//         <Route path="/payroll" element={<ProtectedRoute component={PayrollManagement} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import HRDashboard from './pages/HRr/Dashboard';
import EmployeeDashboard from './pages/Employe/Dashboard';
import EmployeeManagement from './pages/HRr/EmployeeManagement';
import EmployeeDetails from './pages/HRr/EmployeeDetails';
import AttendanceManagement from './pages/HRr/AttendanceManagement';
import LeaveManagement from './pages/HRr/LeaveManagement';
import PayrollManagement from './pages/HRr/PayrollManagement';
import EmployeeAttendance from './pages/Employe/Attendance';
import EmployeeLeave from './pages/Employe/Leave';
import EmployeePayroll from './pages/Employe/Payroll';
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  console.log('Auth Check:', { isAuthenticated, user });

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard'}
      />
    );
  }

  return children;
};

function App() {
  console.log('EmployeeDashboard Rendered');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* HR routes */}

            <Route
              path='/hr/dashboard'
              element={
                // <ProtectedRoute allowedRoles={['hr']}>
                  <HRDashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/hr/employees'
              element={
                // <ProtectedRoute allowedRoles={['hr']}>
                  <EmployeeManagement />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/hr/employees/:id'
              element={
                // <ProtectedRoute allowedRoles={['hr']}>
                  <EmployeeDetails />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/hr/attendance'
              element={
                // <ProtectedRoute allowedRoles={['hr']}>
                  <AttendanceManagement />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/hr/leave'
              element={
                // <ProtectedRoute allowedRoles={['hr']}>
                  <LeaveManagement />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/hr/payroll'
              element={
                // <ProtectedRoute allowedRoles={['hr']}>
                  <PayrollManagement />
                // </ProtectedRoute>
              }
            />

            {/* Employee routes */}
            <Route
              path='/employee/dashboard'
              element={
                // <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/employee/attendance'
              element={
                // <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeAttendance />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/employee/leave'
              element={
                // <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeLeave />
                // </ProtectedRoute>
              }
            />
            <Route
              path='/employee/payroll'
              element={
                // <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeePayroll />
                // </ProtectedRoute>
              }
            />

            {/* Redirect root to login */}
            <Route path='/' element={<Navigate to='/login' />} />

            {/* 404 route */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
       </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
