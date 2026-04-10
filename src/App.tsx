import { useEffect, useMemo, useState } from 'react'
import { httpGetJson } from './lib/http'

type HealthResponse = {
  status: string
  timeUtc: string
}

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const apiHealthPath = useMemo(() => '/api/v1/health', [])

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    httpGetJson<HealthResponse>(apiHealthPath, controller.signal)
      .then((data) => setHealth(data))
      .catch((e: unknown) => {
        const message = typeof e === 'object' && e && 'message' in e ? String((e as any).message) : 'Không thể kết nối API.'
        setError(message)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [apiHealthPath])

  return (
    <main className="container">
      <header className="header">
        <h1>Vua Thợ</h1>
        <p className="subtitle">FE demo kết nối API</p>
      </header>

      <section className="card">
        <h2>Health Check</h2>
        {isLoading ? <p>Đang tải…</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {health ? (
          <dl className="kv">
            <div>
              <dt>Trạng thái</dt>
              <dd>{health.status}</dd>
            </div>
            <div>
              <dt>Time (UTC)</dt>
              <dd>{health.timeUtc}</dd>
            </div>
          </dl>
        ) : null}
      </section>
    </main>
  )
}

