import type { AxiosRequestConfig } from 'axios'
import { apiClient } from '../../lib/apiClient'
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterCustomerRequest,
  SendEmailOtpRequest,
  SendOtpRequest,
  VerifyEmailOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../../types/api/auth'

/** Gửi FormData: bỏ `Content-Type` mặc định JSON để trình duyệt gắn boundary multipart. */
const multipartFormConfig = {
  transformRequest: [
    (data: unknown, headers) => {
      if (data instanceof FormData && headers && typeof headers.delete === 'function') {
        headers.delete('Content-Type')
      }
      return data
    },
  ],
} satisfies AxiosRequestConfig

export async function sendOtp(request: SendOtpRequest) {
  const res = await apiClient.post<{ message: string }>('/api/v1/auth/send-otp', request)
  return res.data
}

export async function verifyOtp(request: VerifyOtpRequest) {
  const res = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/verify-otp', request)
  return res.data
}

export async function sendEmailOtp(request: SendEmailOtpRequest) {
  const res = await apiClient.post<{ message: string }>('/api/v1/auth/send-otp-email', request)
  return res.data
}

export async function verifyEmailOtp(request: VerifyEmailOtpRequest) {
  const res = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/verify-otp-email', request)
  return res.data
}

export async function registerCustomer(request: RegisterCustomerRequest) {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/register/customer', request)
  return res.data
}

export async function registerWorkerExternal(formData: FormData) {
  const res = await apiClient.post<AuthResponse>(
    '/api/v1/auth/register/worker-external',
    formData,
    multipartFormConfig,
  )
  return res.data
}

export async function registerWorkerDirect(formData: FormData) {
  const res = await apiClient.post<AuthResponse>(
    '/api/v1/auth/register/worker-direct',
    formData,
    multipartFormConfig,
  )
  return res.data
}

export async function login(request: LoginRequest) {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/login', request)
  return res.data
}

export async function refreshToken(request: RefreshTokenRequest) {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/refresh-token', request)
  return res.data
}

