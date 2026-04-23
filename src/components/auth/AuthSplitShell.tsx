import { Link } from 'react-router-dom'

type AuthSplitShellProps = {
  children: React.ReactNode
  heroTitle: string
  heroDescription: string
  footerPrompt: string
  footerLinkTo: string
  footerLinkLabel: string
  /** Nút góc phải thanh nav (ví dụ: trang đăng nhập → “Đăng ký”, trang đăng ký → “Đăng nhập”) */
  topCtaTo: string
  topCtaLabel: string
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function AuthSplitShell({
  children,
  heroTitle,
  heroDescription,
  footerPrompt,
  footerLinkTo,
  footerLinkLabel,
  topCtaTo,
  topCtaLabel,
}: AuthSplitShellProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel auth-panel--form">
          <div className="auth-brand">
            <span className="auth-brand__mark" aria-hidden="true">
              Logo
            </span>
            <span className="auth-brand__text">Fixy</span>
          </div>
          {children}
          <div className="auth-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="auth-panel auth-panel--hero">
          <div className="auth-hero__bg" aria-hidden="true" />
          <nav className="auth-hero__nav">
            <a className="auth-hero__nav-link" href="#">
              Giới thiệu
            </a>
            <a className="auth-hero__nav-link" href="#">
              Dịch vụ
            </a>
            <a className="auth-hero__nav-link" href="#">
              Liên hệ
            </a>
            <Link className="auth-hero__nav-pill" to={topCtaTo}>
              {topCtaLabel}
            </Link>
            <button type="button" className="auth-hero__icon-btn" aria-label="Menu">
              <IconMenu />
            </button>
          </nav>
          <div className="auth-hero__content">
            <h2 className="auth-hero__title">{heroTitle}</h2>
            <p className="auth-hero__text">{heroDescription}</p>
          </div>
          <p className="auth-hero__footer">
            {footerPrompt}{' '}
            <Link className="auth-hero__footer-link" to={footerLinkTo}>
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
