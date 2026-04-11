import { useId, useState } from 'react'
import { IconEye, IconEyeOff, IconLock } from './icons'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  /** Gắn vào `<input>` để ghép với `<label htmlFor>` nếu cần */
  id?: string
  required?: boolean
  'aria-labelledby'?: string
}

export function PasswordFieldWithToggle({
  value,
  onChange,
  placeholder = 'Mật khẩu',
  autoComplete = 'current-password',
  id: idProp,
  required = false,
  'aria-labelledby': ariaLabelledBy,
}: Props) {
  const autoId = useId()
  const inputId = idProp ?? autoId
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth-input-group">
      <IconLock />
      <input
        id={inputId}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-labelledby={ariaLabelledBy}
      />
      <button
        type="button"
        className="auth-input-group__toggle-password"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        aria-pressed={visible}
      >
        {visible ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  )
}
