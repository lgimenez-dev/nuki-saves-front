
export type DownloadMode = 'single' | 'multiple'

export type Phase = 'idle' | 'submitting' | 'polling' | 'done' | 'failed'


export interface DownloadOptions {
  mode: DownloadMode
  resolution: string
  videoFormat: string
  audioOnly: boolean
  audioFormat: string
  audioQuality: number
  noWatermark: boolean
}


export interface DownloadRequestBody {
  url: string
  mode: DownloadMode
  resolution?: string
  format?: string
  audioOnly?: boolean
  audioFormat?: string
  audioQuality?: number
  noWatermark?: boolean
  writeThumbnail: true
}


export interface DownloadResponse {
  jobId: string
  status: 'queued'
}

export type JobStatus = 'queued' | 'active' | 'waiting' | 'completed' | 'failed'

export interface StatusResponse {
  jobId: string
  status: JobStatus
  downloadUrl?: string
  thumbnailUrl?: string
  error?: string
}

export interface ErrorResponse {
  error: string
  retryAfterSeconds?: number
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; data: ErrorResponse }


export interface JobState {
  phase: Phase
  error: string | null
}

export interface CancelResponse {
  jobId: string
  status: 'cancelled'
}

export interface JobResult {
  downloadUrl: string
  thumbnailUrl: string | null
}
