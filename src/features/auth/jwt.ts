import { jwtDecode } from 'jwt-decode'

export type JwtPayload = {
  sub?: string
  role?: string
  workerType?: string
  workerStatus?: string
  exp?: number
}

export function decodeJwt(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token)
}

