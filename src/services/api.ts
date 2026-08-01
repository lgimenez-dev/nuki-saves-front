import { API_BASE } from '../constants'
import type { DownloadRequestBody, DownloadResponse, StatusResponse, CancelResponse, ApiResult } from '../types'

export async function postDownload(body: DownloadRequestBody): Promise<ApiResult<DownloadResponse>> {
  const res = await fetch(`${API_BASE}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return {
    ok: res.ok,
    status: res.status,
    data,
  }
}

export async function getStatus(jobId: string): Promise<ApiResult<StatusResponse>> {
  const res = await fetch(`${API_BASE}/status/${jobId}`)
  const data = await res.json()
  return {
    ok: res.ok,
    status: res.status,
    data,
  }
}

export async function deleteDownload(jobId: string): Promise<ApiResult<CancelResponse>> {
  const res = await fetch(`${API_BASE}/download/${jobId}`, { method: 'DELETE' })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

