import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import { AuthProvider } from './features/auth/AuthContext'

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

