import { env } from '@shared/config/env'
import { HttpError } from './types'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const body = (await res.json()) as { error?: string; message?: string }
      message = body.error ?? body.message ?? message
    } catch {
      // ignore parse error
    }
    throw new HttpError(res.status, message)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
