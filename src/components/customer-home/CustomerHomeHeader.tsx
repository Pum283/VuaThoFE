import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'

export function CustomerHomeHeader() {
  const navigate = useNavigate()
  const { state, logout } = useAuth()
  const isSignedIn = Boolean(state.accessToken)

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="customer-home-header">
      <Link to="/home" className="customer-home-brand" aria-label="Vua Thợ — Trang chủ">
        <span className="customer-home-brand__mark" aria-hidden="true">
          V
        </span>
        <span className="customer-home-brand__text">Vua Thợ</span>
      </Link>

      <nav className="customer-home-nav" aria-label="Điều hướng chính">
        <a href="#danh-muc" className="customer-home-nav__link">
          Tìm thợ
        </a>
        <Link to="/register" className="customer-home-nav__link">
          Dành cho thợ
        </Link>
        {isSignedIn ? (
          <button type="button" className="customer-home-nav__btn" onClick={onLogout}>
            Đăng xuất
          </button>
        ) : (
          <Link to="/login" className="customer-home-nav__btn customer-home-nav__btn--primary">
            Đăng nhập
          </Link>
        )}
      </nav>
    </header>
  )
}
