import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DownloadMode } from '../types'

interface JobStore {
  jobId: string | null
  mode: DownloadMode
  saveJob: (jobId: string, mode: DownloadMode) => void
  clearJob: () => void
}

export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      jobId: null,
      mode: 'single',
      saveJob: (jobId, mode) => set({ jobId, mode }),
      clearJob: () => set({ jobId: null }),
    }),
    { name: 'smedia_job' }
  )
)
