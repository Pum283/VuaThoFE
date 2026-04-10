import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { AuthResponse, LoginRequest } from '../../types/api/auth'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './authStorage'
import { decodeJwt } from './jwt'
import * as authApi from './authApi'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  role: string | null
}

type AuthContextValue = {
  state: AuthState
  login: (request: LoginRequest) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getInitialState(): AuthState {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  const role = accessToken ? decodeJwt(accessToken).role ?? null : null
  return { accessToken, refreshToken, role }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => getInitialState())

  const login = useCallback(async (request: LoginRequest) => {
    const result = await authApi.login(request)
    setTokens(result.accessToken, result.refreshToken)
    const payload = decodeJwt(result.accessToken)
    setState({ accessToken: result.accessToken, refreshToken: result.refreshToken, role: payload.role ?? null })
    return result
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setState({ accessToken: null, refreshToken: null, role: null })
  }, [])

  const value = useMemo<AuthContextValue>(() => ({ state, login, logout }), [state, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider.')
  return ctx
}

