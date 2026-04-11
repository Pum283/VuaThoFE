import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { WorkerHomePage } from './pages/WorkerHomePage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/worker/home', element: <WorkerHomePage /> },
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
])

