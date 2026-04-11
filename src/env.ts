const trimOrEmpty = (v: string | undefined) => (typeof v === 'string' ? v.trim() : '')

/**
 * Base URL API. Ưu tiên `VITE_API_BASE_URL`; khi dev mà chưa set thì mặc định profile https của API.
 */
function resolveApiBaseUrl(): string | undefined {
  const fromEnv = trimOrEmpty(import.meta.env.VITE_API_BASE_URL as string | undefined)
  if (fromEnv) {
    return fromEnv
  }
  if (import.meta.env.DEV) {
    return 'https://localhost:7060'
  }
  return undefined
}

export const ENV = {
  apiBaseUrl: resolveApiBaseUrl(),
} as const

