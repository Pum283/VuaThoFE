import { jwtDecode } from 'jwt-decode'

export type JwtPayload = {
  sub?: string
  nameid?: string
  unique_name?: string
  role?: string
  fullName?: string
  phoneNumber?: string
  email?: string
  workerType?: string
  workerStatus?: string
  exp?: number
}

export function decodeJwt(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token)
}

