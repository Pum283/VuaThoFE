import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { OtpInput } from '../components/auth/OtpInput'
import * as authApi from '../features/auth/authApi'
import { useAuth } from '../features/auth/AuthContext'
import {
  buildWorkerDirectRegistrationFormData,
  buildWorkerExternalRegistrationFormData,
  validateWorkerRegistrationFile,
} from '../features/auth/workerRegistrationUpload'
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout'
import { PasswordFieldWithToggle } from '../components/auth/PasswordFieldWithToggle'
import { IconPersonCircle } from '../components/auth/icons'

type RegisterTab = 'Customer' | 'WorkerExternal' | 'WorkerDirect'

function getRedirectPath(role: string) {
  if (role === 'Admin') return '/admin/dashboard'
  if (role === 'Customer') return '/home'
  if (role === 'WorkerExternal' || role === 'WorkerDirect') return '/worker/home'
  return '/home'
}

function getErrorMessage(err: unknown, fallback: string) {
  const ax = err as { response?: { data?: { error?: string } | string[] }; message?: string }
  if (Array.isArray(ax?.response?.data)) return ax.response!.data.join('\n')
  const e = (ax?.response?.data as { error?: string } | undefined)?.error
  return e ?? ax?.message ?? fallback
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [tab, setTab] = useState<RegisterTab>('Customer')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpVerificationToken, setOtpVerificationToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [externalDiploma, setExternalDiploma] = useState<File | null>(null)
  const [externalIdentityCard, setExternalIdentityCard] = useState<File | null>(null)
  const [externalOtherDocuments, setExternalOtherDocuments] = useState<File[]>([])
  const [directCv, setDirectCv] = useState<File | null>(null)

  const onSendEmailOtp = async () => {
    const trimmed = email.trim()
    if (!trimmed) {
      toast.error('Vui lòng nhập email.')
      return
    }
    setIsLoading(true)
    try {
      const res = await authApi.sendEmailOtp({ email: trimmed })
      setOtpVerificationToken(null)
      toast.success(res.message ?? 'Đã gửi OTP qua email.')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Gửi OTP email thất bại.'))
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyEmailOtp = async () => {
    setIsLoading(true)
    try {
      const res = await authApi.verifyEmailOtp({ email: email.trim(), otpCode: otp })
      setOtpVerificationToken(res.otpVerificationToken)
      toast.success('Xác thực OTP email thành công.')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Xác thực OTP thất bại.'))
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async () => {
    if (!otpVerificationToken) {
      toast.error('Bạn cần xác thực OTP email trước khi đăng ký.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.')
      return
    }

    if (tab === 'WorkerExternal') {
      if (!externalIdentityCard) {
        toast.error('Vui lòng đính kèm file CCCD / giấy tờ định danh.')
        return
      }
      const toCheck = [externalIdentityCard, ...(externalDiploma ? [externalDiploma] : []), ...externalOtherDocuments]
      for (const f of toCheck) {
        const msg = validateWorkerRegistrationFile(f)
        if (msg) {
          toast.error(msg)
          return
        }
      }
    }

    if (tab === 'WorkerDirect') {
      if (!directCv) {
        toast.error('Vui lòng đính kèm file CV.')
        return
      }
      const msg = validateWorkerRegistrationFile(directCv)
      if (msg) {
        toast.error(msg)
        return
      }
    }

    setIsLoading(true)
    try {
      const base = {
        otpVerificationToken,
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      }

      const res =
        tab === 'Customer'
          ? await authApi.registerCustomer(base)
          : tab === 'WorkerExternal'
            ? await authApi.registerWorkerExternal(
                buildWorkerExternalRegistrationFormData({
                  ...base,
                  diploma: externalDiploma,
                  identityCard: externalIdentityCard!,
                  otherDocuments: externalOtherDocuments,
                }),
              )
            : await authApi.registerWorkerDirect(
                buildWorkerDirectRegistrationFormData({
                  ...base,
                  cv: directCv!,
                }),
              )

      toast.success('Đăng ký thành công.')
      await login({ identifier: phoneNumber.trim(), password })
      navigate(getRedirectPath(res.userInfo.role))
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Đăng ký thất bại.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      heroTitle="Tham gia."
      heroSubtitle="Tạo tài khoản để đặt dịch vụ hoặc trở thành đối tác thợ trên nền tảng Vua Thợ."
      footerCta={{ text: 'Đã có tài khoản?', linkText: 'Đăng nhập', to: '/login' }}
      topRightTo="/login"
      topRightLabel="Đăng nhập"
    >
      <div className="auth-form-panel__avatar" aria-hidden="true">
        <IconPersonCircle />
      </div>

      <h1 className="auth-form-panel__title">Đăng ký</h1>

      <div className="auth-tabs" role="tablist" aria-label="Loại tài khoản">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'Customer'}
          className={tab === 'Customer' ? 'auth-tab active' : 'auth-tab'}
          onClick={() => {
            setTab('Customer')
            setExternalDiploma(null)
            setExternalIdentityCard(null)
            setExternalOtherDocuments([])
            setDirectCv(null)
          }}
        >
          Khách hàng
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'WorkerExternal'}
          className={tab === 'WorkerExternal' ? 'auth-tab active' : 'auth-tab'}
          onClick={() => {
            setTab('WorkerExternal')
            setDirectCv(null)
          }}
        >
          Thợ ngoài
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'WorkerDirect'}
          className={tab === 'WorkerDirect' ? 'auth-tab active' : 'auth-tab'}
          onClick={() => {
            setTab('WorkerDirect')
            setExternalDiploma(null)
            setExternalIdentityCard(null)
            setExternalOtherDocuments([])
          }}
        >
          Thợ công ty
        </button>
      </div>

      <div className="auth-form-stack">
        <div className="auth-field">
          <span className="auth-label">Email (nhận OTP)</span>
          <div className="auth-inline-row">
            <input
              className="auth-input-plain"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setOtpVerificationToken(null)
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <button
              className="auth-secondary-btn auth-secondary-btn--compact"
              type="button"
              onClick={onSendEmailOtp}
              disabled={isLoading}
            >
              Gửi OTP
            </button>
          </div>
        </div>

        <OtpInput
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
          label="Mã OTP từ email"
          actionSlot={
            <button
              className="auth-secondary-btn auth-secondary-btn--compact"
              type="button"
              onClick={onVerifyEmailOtp}
              disabled={isLoading}
            >
              Xác nhận OTP
            </button>
          }
        />

        <div className="auth-hint-row">
          <span className="auth-hint">{otpVerificationToken ? 'Email đã xác thực' : 'Chưa xác thực email'}</span>
        </div>

        <label className="auth-field">
          <span className="auth-label">Số điện thoại (đăng nhập)</span>
          <input
            className="auth-input-plain"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="090..."
            inputMode="tel"
            autoComplete="tel"
          />
        </label>

        <label className="auth-field">
          <span className="auth-label">Họ và tên</span>
          <input className="auth-input-plain" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
        </label>

        <div className="auth-field">
          <span className="auth-label" id="register-password-label">
            Mật khẩu
          </span>
          <PasswordFieldWithToggle
            id="register-password"
            value={password}
            onChange={setPassword}
            placeholder="Mật khẩu"
            autoComplete="new-password"
            aria-labelledby="register-password-label"
          />
        </div>

        <div className="auth-field">
          <span className="auth-label" id="register-confirm-password-label">
            Xác nhận lại mật khẩu
          </span>
          <PasswordFieldWithToggle
            id="register-confirm-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            aria-labelledby="register-confirm-password-label"
          />
        </div>

        {tab === 'WorkerExternal' ? (
          <>
            <div className="auth-field">
              <span className="auth-label">Bằng cấp (tuỳ chọn)</span>
              <input
                className="auth-input-plain"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => setExternalDiploma(e.target.files?.[0] ?? null)}
              />
              {externalDiploma ? <span className="auth-hint">{externalDiploma.name}</span> : null}
            </div>
            <div className="auth-field">
              <span className="auth-label">CCCD / giấy tờ định danh (bắt buộc)</span>
              <input
                className="auth-input-plain"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => setExternalIdentityCard(e.target.files?.[0] ?? null)}
              />
              {externalIdentityCard ? <span className="auth-hint">{externalIdentityCard.name}</span> : null}
            </div>
            <div className="auth-field">
              <span className="auth-label">Giấy tờ khác (tuỳ chọn, có thể chọn nhiều file)</span>
              <input
                className="auth-input-plain"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => setExternalOtherDocuments(e.target.files ? Array.from(e.target.files) : [])}
              />
              {externalOtherDocuments.length > 0 ? (
                <span className="auth-hint">{externalOtherDocuments.map((f) => f.name).join(', ')}</span>
              ) : null}
            </div>
            <p className="auth-hint">Định dạng: PDF, JPG, PNG, WEBP — tối đa 10 MB mỗi file.</p>
          </>
        ) : null}

        {tab === 'WorkerDirect' ? (
          <>
            <div className="auth-field">
              <span className="auth-label">CV (bắt buộc)</span>
              <input
                className="auth-input-plain"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => setDirectCv(e.target.files?.[0] ?? null)}
              />
              {directCv ? <span className="auth-hint">{directCv.name}</span> : null}
            </div>
            <p className="auth-hint">Định dạng: PDF, JPG, PNG, WEBP — tối đa 10 MB.</p>
          </>
        ) : null}

        <button className="auth-primary-btn" type="button" onClick={onRegister} disabled={isLoading}>
          {isLoading ? 'Đang xử lý…' : 'Hoàn tất đăng ký'}
        </button>
      </div>

      <div className="auth-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </AuthSplitLayout>
  )
}
