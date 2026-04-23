import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { AuthResponse, LoginRequest } from '../../types/api/auth'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './authStorage'
import { decodeJwt } from './jwt'
import * as authApi from './authApi'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  role: string | null
  fullName: string | null
}

type AuthContextValue = {
  state: AuthState
  login: (request: LoginRequest) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Lấy tên hiển thị từ JWT theo nhiều chuẩn claim khác nhau. */
function resolveFullName(accessToken: string | null) {
  if (!accessToken) return null
  const payload = decodeJwt(accessToken) as Record<string, string | undefined>
  return payload.fullName ?? payload.unique_name ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? null
}

function getInitialState(): AuthState {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  const role = accessToken ? decodeJwt(accessToken).role ?? null : null
  const fullName = resolveFullName(accessToken)
  return { accessToken, refreshToken, role, fullName }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => getInitialState())

  const login = useCallback(async (request: LoginRequest) => {
    const result = await authApi.login(request)
    setTokens(result.accessToken, result.refreshToken)
    const payload = decodeJwt(result.accessToken)
    setState({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      role: payload.role ?? null,
      fullName: resolveFullName(result.accessToken) ?? result.userInfo.fullName ?? null,
    })
    return result
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setState({ accessToken: null, refreshToken: null, role: null, fullName: null })
  }, [])

  const value = useMemo<AuthContextValue>(() => ({ state, login, logout }), [state, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider.')
  return ctx
}

