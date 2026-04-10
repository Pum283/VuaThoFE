import { apiClient } from '../../lib/apiClient'
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterCustomerRequest,
  RegisterWorkerDirectRequest,
  RegisterWorkerExternalRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../../types/api/auth'

export async function sendOtp(request: SendOtpRequest) {
  const res = await apiClient.post<{ message: string }>('/api/v1/auth/send-otp', request)
  return res.data
}

export async function verifyOtp(request: VerifyOtpRequest) {
  const res = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/verify-otp', request)
  return res.data
}

export async function registerCustomer(request: RegisterCustomerRequest) {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/register/customer', request)
  return res.data
}

export async function registerWorkerExternal(request: RegisterWorkerExternalRequest) {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/register/worker-external', request)
  return res.data
}

export async function registerWorkerDirect(request: RegisterWorkerDirectRequest) {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/register/worker-direct', request)
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

