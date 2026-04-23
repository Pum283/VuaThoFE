import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

function getRoleLabel(role: string | null) {
  if (role === 'Admin') return 'Admin'
  if (role === 'Customer') return 'Khách hàng'
  if (role === 'WorkerExternal') return 'Thợ'
  return 'Người dùng'
}

export function RoleLandingPage() {
  const navigate = useNavigate()
  const { state, logout } = useAuth()

  const onLogout = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  return (
    <main className="auth-split">
      <section className="auth-form-panel">
        <h1 className="auth-form-panel__title">Đăng nhập thành công</h1>
        <p className="subtitle">
          Vai trò: <strong>{getRoleLabel(state.role ?? null)}</strong>
        </p>
        <button className="auth-primary-btn" type="button" onClick={onLogout}>
          Đăng xuất
        </button>
      </section>
    </main>
  )
}

