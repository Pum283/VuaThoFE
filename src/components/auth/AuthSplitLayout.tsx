import { Link } from 'react-router-dom'

type AuthSplitLayoutProps = {
  children: React.ReactNode
  heroTitle?: string
  heroSubtitle?: string
  footerCta?: { text: string; linkText: string; to: string }
  topRightTo?: string
  topRightLabel?: string
}

export function AuthSplitLayout({
  children,
  heroTitle = 'Chào mừng.',
  heroSubtitle = 'Fixy - sửa gì cũng dễ',
  footerCta,
  topRightTo = '/login',
  topRightLabel = 'Đăng nhập',
}: AuthSplitLayoutProps) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <aside className="auth-form-panel">
          <div className="auth-form-panel__brand">
            <span className="auth-form-panel__logo-placeholder" aria-hidden="true">
              Logo
            </span>
            <div className="auth-form-panel__brand-copy">
              <p className="auth-form-panel__brand-name">Fixy</p>
              <p className="auth-form-panel__brand-slogan">Fixy - sửa gì cũng dễ</p>
            </div>
          </div>
          {children}
        </aside>

        <aside className="auth-hero" aria-label="Giới thiệu ngắn">
          <div className="auth-hero__bg" aria-hidden="true">
            <div className="auth-hero__blob auth-hero__blob--1" />
            <div className="auth-hero__blob auth-hero__blob--2" />
            <div className="auth-hero__blob auth-hero__blob--3" />
          </div>

          <div className="auth-hero__top-bar">
            <nav className="auth-hero__nav">
              <span className="auth-hero__nav-link">Giới thiệu</span>
              <span className="auth-hero__nav-link">Tải app</span>
              <span className="auth-hero__nav-link">Bảng giá</span>
              <span className="auth-hero__nav-link">Liên hệ</span>
            </nav>
            <div className="auth-hero__top-right">
              <Link className="auth-hero__signin" to={topRightTo}>
                {topRightLabel}
              </Link>
              <button type="button" className="auth-hero__menu" aria-label="Menu">
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>

          <div className="auth-hero__content">
            <h2 className="auth-hero__title">{heroTitle}</h2>
            <p className="auth-hero__subtitle">{heroSubtitle}</p>
          </div>

          {footerCta ? (
            <p className="auth-hero__footer-cta">
              {footerCta.text}{' '}
              <Link to={footerCta.to} className="auth-hero__footer-link">
                {footerCta.linkText}
              </Link>
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
