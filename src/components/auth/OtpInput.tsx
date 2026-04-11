import { useId, useMemo, type ReactNode } from 'react'

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  inputClassName = 'auth-input-plain',
  label = 'Mã OTP từ email',
  actionSlot,
}: {
  value: string
  onChange: (next: string) => void
  length?: number
  disabled?: boolean
  inputClassName?: string
  label?: string
  /** Nút / hành động cùng hàng với ô nhập OTP (bên phải) */
  actionSlot?: ReactNode
}) {
  const id = useId()
  const normalized = useMemo(() => value.replace(/\D/g, '').slice(0, length), [value, length])

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>
      {actionSlot ? (
        <div className="auth-inline-row">
          <input
            id={id}
            className={inputClassName}
            inputMode="numeric"
            placeholder={`Nhập ${length} số`}
            value={normalized}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
          {actionSlot}
        </div>
      ) : (
        <input
          id={id}
          className={inputClassName}
          inputMode="numeric"
          placeholder={`Nhập ${length} số`}
          value={normalized}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  )
}

