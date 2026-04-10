import { useMemo } from 'react'

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
}: {
  value: string
  onChange: (next: string) => void
  length?: number
  disabled?: boolean
}) {
  const normalized = useMemo(() => value.replace(/\D/g, '').slice(0, length), [value, length])

  return (
    <label className="field">
      <span className="label">Mã OTP</span>
      <input
        className="input"
        inputMode="numeric"
        placeholder={`Nhập ${length} số`}
        value={normalized}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </label>
  )
}

