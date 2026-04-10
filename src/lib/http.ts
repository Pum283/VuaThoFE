import { ENV } from '../env'

export type ApiError = {
  message: string
  status?: number
}

export async function httpGetJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const baseUrl = (ENV.apiBaseUrl ?? '').replace(/\/$/, '')
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    const message = `Yêu cầu thất bại (HTTP ${response.status}).`
    const error: ApiError = { message, status: response.status }
    throw error
  }

  return (await response.json()) as T
}

