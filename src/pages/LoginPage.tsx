import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../features/auth/AuthContext'
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout'
import { PasswordFieldWithToggle } from '../components/auth/PasswordFieldWithToggle'
import { IconPersonCircle, IconUser } from '../components/auth/icons'

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
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await login({ identifier, password })
      toast.success('Đăng nhập thành công.')
      navigate(getRedirectPath(res.userInfo.role))
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } | string[] }; message?: string }
      const message = Array.isArray(ax?.response?.data)
        ? ax.response!.data.join('\n')
        : (ax?.response?.data as { error?: string } | undefined)?.error ?? ax?.message ?? 'Đăng nhập thất bại.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      heroTitle="Chào mừng."
      heroSubtitle="Đăng nhập để tiếp tục đặt lịch, theo dõi thợ và quản lý tài khoản của bạn trên Vua Thợ."
      footerCta={{ text: 'Chưa có tài khoản?', linkText: 'Đăng ký ngay', to: '/register' }}
      topRightTo="/register"
      topRightLabel="Đăng ký"
    >
      <div className="auth-form-panel__avatar" aria-hidden="true">
        <IconPersonCircle />
      </div>

      <h1 className="auth-form-panel__title">Đăng nhập</h1>
      <p className="auth-form-panel__lead">Số điện thoại hoặc email và mật khẩu</p>

      <form className="auth-form-stack" onSubmit={onSubmit}>
        <div>
          <div className="auth-input-group">
            <IconUser />
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Số điện thoại / Email"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div>
          <PasswordFieldWithToggle
            value={password}
            onChange={setPassword}
            placeholder="Mật khẩu"
            autoComplete="current-password"
            required
          />
        </div>

        <button className="auth-primary-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>

        <div className="auth-row-between">
          <label className="auth-checkbox">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Ghi nhớ đăng nhập
          </label>
          <Link className="auth-link-muted" to="/forgot-password">
            Quên mật khẩu?
          </Link>
        </div>
      </form>

      <div className="auth-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </AuthSplitLayout>
  )
}
