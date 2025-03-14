# HRMS (Human Resource Management System) - MERN Stack

## Overview
The **HRMS System** is a full-stack web application built using **MongoDB, Express.js, React.js, and Node.js (MERN)**. It manages employees, attendance, leaves, and payroll while ensuring authentication and authorization.

## Features
- **User Authentication** (JWT-based login for HR & Employees)
- **Employee Management** (CRUD operations)
- **Attendance System** (Check-in & Check-out APIs)
- **Leave Management** (Apply, Approve/Reject leaves)
- **Payroll Calculation** (Salary processing based on attendance & leaves)
- **Role-Based Access Control** (HR vs Employee permissions)
- **Frontend UI** using **React, MUI, and CSS**
- **Backend APIs** built with **Node.js & Express**

## Tech Stack
- **Frontend:** React.js, MUI (Material UI), CSS, Axios
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Database:** MongoDB

---

# 📌 Backend Setup

## 1️⃣ Install Dependencies
```bash
cd backend
npm install
```

## 2️⃣ Configure Environment Variables
Create a `.env` file in the backend root folder and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 3️⃣ Start Backend Server
```bash
npm run dev
```

## 4️⃣ API Endpoints
### **🔹 Authentication Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user (HR or Employee) |

### **🔹 Employee Management**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/employees` | Create an employee (HR only) |
| GET | `/api/employees` | Get all employees (HR only) |
| GET | `/api/employees/:id` | Get employee details |
| PUT | `/api/employees/:id` | Update employee details (HR only) |
| DELETE | `/api/employees/:id` | Remove an employee (HR only) |

### **🔹 Attendance System**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/attendance/checkin` | Employee check-in |
| POST | `/api/attendance/checkout` | Employee check-out |
| GET | `/api/attendance/:employeeId` | Get employee attendance |

### **🔹 Leave Management**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/leaves/apply` | Employee applies for leave |
| GET | `/api/leaves` | Get leave requests (HR only) |
| PUT | `/api/leaves/approve/:id` | Approve leave (HR only) |
| PUT | `/api/leaves/reject/:id` | Reject leave (HR only) |

### **🔹 Payroll Management**
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/payroll/:employeeId` | Calculate salary for employee |

---

# 📌 Frontend Setup

## 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```

## 2️⃣ Start Frontend Server
```bash
npm start
```

## 3️⃣ Frontend Structure
```
frontend/
│── src/
│   ├── components/         # Reusable UI components (Navbar, Sidebar, etc.)
│   ├── pages/              # Page components (Login, Dashboard, Employees, Payroll, etc.)
│   ├── context/AuthContext # Manages user authentication
│   ├── services/api.js     # API calls using Axios
│   ├── App.js              # Main component
│   ├── index.js            # React root file
│   └── styles.css          # Global CSS file
```

## 4️⃣ Frontend Routes
| Path | Page |
|------|------|
| `/login` | User Login |
| `/dashboard` | Dashboard (HR & Employees) |
| `/employees` | Manage Employees (HR only) |
| `/attendance` | Employee Attendance |
| `/leave` | Apply for Leave |
| `/payroll` | Payroll Calculation (HR only) |

---

# 🔑 **Authentication & Authorization Flow**
1. **User Registration & Login:**
   - Employees & HR register via **`POST /api/auth/register`** (only HR can add employees)
   - Login via **`POST /api/auth/login`** and get a JWT token
   - Store token in **localStorage** after login

2. **Role-Based Access Control:**
   - HR has **full access** (add employees, manage payroll & leaves)
   - Employees can **only check their data** (apply for leave, view payroll)

---

# ✅ **How to Test Backend Using Postman**
### **Step 1:** Register an HR
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Admin HR",
  "email": "hr@example.com",
  "password": "admin123",
  "role": "HR"
}
```

### **Step 2:** Login as HR
```json
POST http://localhost:5000/api/auth/login
{
  "email": "hr@example.com",
  "password": "admin123"
}
```
_Response:_
```json
{
  "token": "your_jwt_token"
}
```

### **Step 3:** Use HR Token to Create an Employee
```json
POST http://localhost:5000/api/employees
Headers: { Authorization: "Bearer your_jwt_token" }
{
  "name": "admin123",
  "email": "hr@example.com",
  "password": "admin123",
  "salary": 50000
}
``
---

## 🚀 **Now You're Ready to Run Your HRMS System!**

