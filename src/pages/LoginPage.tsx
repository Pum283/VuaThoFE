import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../features/auth/AuthContext'

function getRedirectPath(role: string | null) {
  if (role === 'Admin') return '/admin/dashboard'
  if (role === 'Customer') return '/home'
  if (role === 'WorkerExternal' || role === 'WorkerDirect') return '/worker/home'
  return '/home'
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await login({ identifier, password })
      toast.success('Đăng nhập thành công.')
      navigate(getRedirectPath(res.userInfo.role))
    } catch (err: any) {
      const message =
        Array.isArray(err?.response?.data) ? err.response.data.join('\n') : err?.response?.data?.error ?? err?.message ?? 'Đăng nhập thất bại.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Đăng nhập</h1>
        <p className="subtitle">Số điện thoại hoặc email + mật khẩu</p>
      </header>

      <section className="card">
        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="label">Số điện thoại hoặc email</span>
            <input className="input" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="090..." />
          </label>

          <label className="field">
            <span className="label">Mật khẩu</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <div className="actions">
            <button className="button" type="submit" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
            <a className="link" href="/register">
              Chưa có tài khoản? Đăng ký
            </a>
          </div>
        </form>
      </section>
    </main>
  )
}

