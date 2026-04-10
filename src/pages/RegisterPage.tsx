import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { OtpInput } from '../components/auth/OtpInput'
import * as authApi from '../features/auth/authApi'
import { useAuth } from '../features/auth/AuthContext'

type RegisterTab = 'Customer' | 'WorkerExternal' | 'WorkerDirect'

function getRedirectPath(role: string) {
  if (role === 'Admin') return '/admin/dashboard'
  if (role === 'Customer') return '/home'
  if (role === 'WorkerExternal' || role === 'WorkerDirect') return '/worker/home'
  return '/home'
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [tab, setTab] = useState<RegisterTab>('Customer')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpVerificationToken, setOtpVerificationToken] = useState<string | null>(null)
  const [latitude, setLatitude] = useState('10.762622')
  const [longitude, setLongitude] = useState('106.660172')
  const [isLoading, setIsLoading] = useState(false)

  const isWorker = useMemo(() => tab === 'WorkerExternal' || tab === 'WorkerDirect', [tab])

  const onSendOtp = async () => {
    setIsLoading(true)
    try {
      const res = await authApi.sendOtp({ phoneNumber })
      toast.success(res.message ?? 'Đã gửi OTP.')
    } catch (err: any) {
      const message =
        Array.isArray(err?.response?.data) ? err.response.data.join('\n') : err?.response?.data?.error ?? err?.message ?? 'Gửi OTP thất bại.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyOtp = async () => {
    setIsLoading(true)
    try {
      const res = await authApi.verifyOtp({ phoneNumber, otpCode: otp })
      setOtpVerificationToken(res.otpVerificationToken)
      toast.success('Xác thực OTP thành công.')
    } catch (err: any) {
      const message =
        Array.isArray(err?.response?.data) ? err.response.data.join('\n') : err?.response?.data?.error ?? err?.message ?? 'Xác thực OTP thất bại.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async () => {
    if (!otpVerificationToken) {
      toast.error('Bạn cần xác thực OTP trước khi đăng ký.')
      return
    }

    setIsLoading(true)
    try {
      const base = {
        otpVerificationToken,
        phoneNumber,
        email: email || null,
        password,
        fullName,
      }

      const lat = Number(latitude)
      const lng = Number(longitude)

      const res =
        tab === 'Customer'
          ? await authApi.registerCustomer(base)
          : tab === 'WorkerExternal'
            ? await authApi.registerWorkerExternal({ ...base, latitude: lat, longitude: lng })
            : await authApi.registerWorkerDirect({ ...base, latitude: lat, longitude: lng })

      toast.success('Đăng ký thành công.')
      // Lưu token như backend trả về
      await login({ identifier: phoneNumber, password })
      navigate(getRedirectPath(res.userInfo.role))
    } catch (err: any) {
      const message =
        Array.isArray(err?.response?.data) ? err.response.data.join('\n') : err?.response?.data?.error ?? err?.message ?? 'Đăng ký thất bại.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Đăng ký</h1>
        <p className="subtitle">Chọn loại tài khoản và xác thực OTP trước khi tạo mật khẩu</p>
      </header>

      <section className="card">
        <div className="tabs">
          <button className={tab === 'Customer' ? 'tab active' : 'tab'} onClick={() => setTab('Customer')} type="button">
            Khách hàng
          </button>
          <button className={tab === 'WorkerExternal' ? 'tab active' : 'tab'} onClick={() => setTab('WorkerExternal')} type="button">
            Thợ ngoài
          </button>
          <button className={tab === 'WorkerDirect' ? 'tab active' : 'tab'} onClick={() => setTab('WorkerDirect')} type="button">
            Thợ trực thuộc
          </button>
        </div>

        <div className="form">
          <label className="field">
            <span className="label">Số điện thoại</span>
            <input className="input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="090..." />
          </label>

          <div className="actions">
            <button className="button secondary" type="button" onClick={onSendOtp} disabled={isLoading}>
              Gửi OTP
            </button>
          </div>

          <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />

          <div className="actions">
            <button className="button secondary" type="button" onClick={onVerifyOtp} disabled={isLoading}>
              Xác thực OTP
            </button>
            {otpVerificationToken ? <span className="hint">OTP đã xác thực</span> : <span className="hint">Chưa xác thực</span>}
          </div>

          <label className="field">
            <span className="label">Họ và tên</span>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>

          <label className="field">
            <span className="label">Email (tuỳ chọn)</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="field">
            <span className="label">Mật khẩu</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          {isWorker ? (
            <div className="grid2">
              <label className="field">
                <span className="label">Latitude</span>
                <input className="input" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
              </label>
              <label className="field">
                <span className="label">Longitude</span>
                <input className="input" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
              </label>
            </div>
          ) : null}

          <div className="actions">
            <button className="button" type="button" onClick={onRegister} disabled={isLoading}>
              {isLoading ? 'Đang xử lý…' : 'Hoàn tất đăng ký'}
            </button>
            <a className="link" href="/login">
              Đã có tài khoản? Đăng nhập
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

