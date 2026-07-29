export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ApiError {
  message: string
  code?: string
  status: number
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'HttpError'
  }
}
