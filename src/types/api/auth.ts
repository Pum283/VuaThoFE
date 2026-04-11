export type WorkerType = 'Direct' | 'External'
export type WorkerStatus = 'Pending' | 'Approved' | 'Rejected' | 'Inactive'

export type SendOtpRequest = {
  phoneNumber: string
}

export type SendEmailOtpRequest = {
  email: string
}

export type VerifyOtpRequest = {
  phoneNumber: string
  otpCode: string
}

export type VerifyEmailOtpRequest = {
  email: string
  otpCode: string
}

export type VerifyOtpResponse = {
  otpVerificationToken: string
  expiresAtUtc: string
}

export type RegisterCustomerRequest = {
  otpVerificationToken: string
  phoneNumber: string
  email: string
  password: string
  fullName: string
}

export type RegisterWorkerExternalRequest = {
  otpVerificationToken: string
  phoneNumber: string
  email: string
  password: string
  fullName: string
}

export type RegisterWorkerDirectRequest = RegisterWorkerExternalRequest

export type LoginRequest = {
  identifier: string
  password: string
}

export type RefreshTokenRequest = {
  refreshToken: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  userInfo: {
    userId: number
    phoneNumber: string
    email?: string | null
    fullName: string
    role: string
    workerType?: WorkerType | null
    workerStatus?: WorkerStatus | null
  }
}

