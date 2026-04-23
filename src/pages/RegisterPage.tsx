import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { OtpInput } from '../components/auth/OtpInput'
import * as authApi from '../features/auth/authApi'
import { useAuth } from '../features/auth/AuthContext'
import { getCategories } from '../features/categories/categoriesApi'
import {
  buildWorkerExternalRegistrationFormData,
  validateWorkerRegistrationFile,
} from '../features/auth/workerRegistrationUpload'
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout'
import { PasswordFieldWithToggle } from '../components/auth/PasswordFieldWithToggle'
import type { CategoryDto } from '../types/api/category'

type RegisterTab = 'Customer' | 'WorkerExternal'

const REGISTER_ROLE_HERO_CONTENT: Record<RegisterTab, { title: string; subtitle: string }> = {
  Customer: {
    title: 'Khách hàng.',
    subtitle: 'Tạo tài khoản để đặt dịch vụ, theo dõi lịch hẹn và quản lý nhu cầu sửa chữa nhanh chóng.',
  },
  WorkerExternal: {
    title: 'Thợ.',
    subtitle: 'Đăng ký hồ sơ thợ, gửi giấy tờ xác minh và chờ duyệt để bắt đầu nhận việc trên Fixy.',
  },
}

function getRedirectPath(role: string) {
  if (role === 'Admin' || role === 'Customer' || role === 'WorkerExternal') return '/app'
  return '/app'
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
  const heroContent = REGISTER_ROLE_HERO_CONTENT[tab]

  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

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

  useEffect(() => {
    if (tab !== 'WorkerExternal') return
    if (categories.length > 0) return

    setIsLoadingCategories(true)
    getCategories()
      .then((data) => {
        setCategories(data)
      })
      .catch(() => {
        toast.error('Không thể tải danh sách chuyên môn. Vui lòng thử lại.')
      })
      .finally(() => {
        setIsLoadingCategories(false)
      })
  }, [categories.length, tab])

  const categoryById = useMemo(() => {
    return Object.fromEntries(categories.map((c) => [c.id, c]))
  }, [categories])

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
      if (selectedCategoryIds.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 chuyên môn.')
        return
      }
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
          : await authApi.registerWorkerExternal(
              buildWorkerExternalRegistrationFormData({
                ...base,
                categoryIds: selectedCategoryIds,
                diploma: externalDiploma,
                identityCard: externalIdentityCard!,
                otherDocuments: externalOtherDocuments,
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
      heroTitle={heroContent.title}
      heroSubtitle={heroContent.subtitle}
      footerCta={{ text: 'Đã có tài khoản?', linkText: 'Đăng nhập', to: '/login' }}
      topRightTo="/login"
      topRightLabel="Đăng nhập"
    >
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
            setSelectedCategoryIds([])
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
          }}
        >
          Thợ
        </button>
      </div>

      <div className="auth-form-stack auth-form-stack--register">
        <div className="auth-grid2 auth-grid2--register-top">
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
        </div>

        <div className="auth-hint-row">
          <span className="auth-hint">{otpVerificationToken ? 'Email đã xác thực' : 'Chưa xác thực email'}</span>
        </div>

        <div className="auth-grid2">
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
        </div>

        <div className="auth-grid2">
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
        </div>

        {tab === 'WorkerExternal' ? (
          <div className="auth-upload-grid">
            <section className="auth-upload-card auth-upload-card--full" aria-label="Chọn chuyên môn">
              <div className="auth-upload-card__head">
                <span className="auth-label">Chuyên môn</span>
                <span className="auth-upload-card__tag auth-upload-card__tag--required">Bắt buộc</span>
              </div>
              {isLoadingCategories ? (
                <p className="hint">Đang tải danh sách chuyên môn...</p>
              ) : categories.length === 0 ? (
                <p className="hint">Chưa có chuyên môn nào. Vui lòng liên hệ admin để tạo danh sách.</p>
              ) : (
                <div className="auth-upload-card__dropzone" role="group" aria-label="Danh sách chuyên môn">
                  {categories.map((cat) => {
                    const checked = selectedCategoryIds.includes(cat.id)
                    return (
                      <label key={cat.id} className="auth-inline-row">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? Array.from(new Set([...selectedCategoryIds, cat.id]))
                              : selectedCategoryIds.filter((id) => id !== cat.id)
                            setSelectedCategoryIds(next)
                          }}
                        />
                        <span>
                          {cat.name}
                          {cat.description ? <span className="hint"> — {cat.description}</span> : null}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
              {selectedCategoryIds.length > 0 ? (
                <p className="hint">
                  Đã chọn: {selectedCategoryIds.map((id) => categoryById[id]?.name ?? id).join(', ')}
                </p>
              ) : null}
            </section>

            <div className="auth-upload-card">
              <div className="auth-upload-card__head">
                <span className="auth-label">Bằng cấp</span>
                <span className="auth-upload-card__tag">Tuỳ chọn</span>
              </div>
              <label className="auth-upload-card__dropzone">
                <input
                  className="auth-upload-card__input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => setExternalDiploma(e.target.files?.[0] ?? null)}
                />
                {externalDiploma ? (
                  <>
                    <span className="auth-upload-card__selected-name">{externalDiploma.name}</span>
                    <span className="auth-upload-card__cta auth-upload-card__cta--small">Tải lại</span>
                  </>
                ) : (
                  <>
                    <span className="auth-upload-card__cta">Chọn tệp</span>
                    <span className="auth-upload-card__meta">PDF, JPG, PNG, WEBP - tối đa 10 MB</span>
                  </>
                )}
              </label>
            </div>
            <div className="auth-upload-card">
              <div className="auth-upload-card__head">
                <span className="auth-label">CCCD</span>
                <span className="auth-upload-card__tag auth-upload-card__tag--required">Bắt buộc</span>
              </div>
              <label className="auth-upload-card__dropzone">
                <input
                  className="auth-upload-card__input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => setExternalIdentityCard(e.target.files?.[0] ?? null)}
                />
                {externalIdentityCard ? (
                  <>
                    <span className="auth-upload-card__selected-name">{externalIdentityCard.name}</span>
                    <span className="auth-upload-card__cta auth-upload-card__cta--small">Tải lại</span>
                  </>
                ) : (
                  <>
                    <span className="auth-upload-card__cta">Chọn tệp</span>
                    <span className="auth-upload-card__meta">PDF, JPG, PNG, WEBP - tối đa 10 MB</span>
                  </>
                )}
              </label>
            </div>
            <div className="auth-upload-card auth-upload-card--full">
              <div className="auth-upload-card__head">
                <span className="auth-label">Giấy tờ khác</span>
                <span className="auth-upload-card__tag">Tuỳ chọn</span>
              </div>
              <label className="auth-upload-card__dropzone">
                <input
                  className="auth-upload-card__input"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => setExternalOtherDocuments(e.target.files ? Array.from(e.target.files) : [])}
                />
                {externalOtherDocuments.length > 0 ? (
                  <>
                    <span className="auth-upload-card__selected-name">
                      {externalOtherDocuments[externalOtherDocuments.length - 1].name}
                    </span>
                    <span className="auth-upload-card__meta">{externalOtherDocuments.length} tệp đã chọn</span>
                    <span className="auth-upload-card__cta auth-upload-card__cta--small">Tải lại</span>
                  </>
                ) : (
                  <>
                    <span className="auth-upload-card__cta">Chọn nhiều tệp</span>
                    <span className="auth-upload-card__meta">PDF, JPG, PNG, WEBP - tối đa 10 MB mỗi tệp</span>
                  </>
                )}
              </label>
            </div>
          </div>
        ) : null}

        <button className="auth-primary-btn" type="button" onClick={onRegister} disabled={isLoading}>
          {isLoading ? 'Đang xử lý…' : 'Hoàn tất đăng ký'}
        </button>
      </div>

    </AuthSplitLayout>
  )
}
