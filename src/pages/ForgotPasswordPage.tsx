import { Link } from 'react-router-dom'
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout'
import { IconPersonCircle } from '../components/auth/icons'

export function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      heroTitle="Hỗ trợ."
      heroSubtitle="Nếu bạn quên mật khẩu, hãy liên hệ bộ phận hỗ trợ hoặc dùng luồng đặt lại mật khẩu khi tính năng được bật."
      footerCta={{ text: 'Nhớ mật khẩu rồi?', linkText: 'Đăng nhập', to: '/login' }}
      topRightTo="/register"
      topRightLabel="Đăng ký"
    >
      <div className="auth-form-panel__avatar" aria-hidden="true">
        <IconPersonCircle />
      </div>

      <h1 className="auth-form-panel__title">Quên mật khẩu</h1>
      <p className="auth-form-panel__lead">Tính năng đặt lại mật khẩu đang được hoàn thiện. Vui lòng quay lại sau hoặc đăng ký tài khoản mới.</p>

      <div className="auth-form-stack">
        <Link className="auth-primary-btn" to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          Quay lại đăng nhập
        </Link>
      </div>

      <div className="auth-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </AuthSplitLayout>
  )
}
