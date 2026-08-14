import type { DownloadMode, DownloadOptions} from './types'

export const API_BASE = '/api'

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string

export const POLL_INTERVAL: Record<DownloadMode, number> = {
  single: 4000,
  multiple: 60000,
}

export const RESOLUTIONS = [
  { value: '', label: 'Best available' },
  { value: '2160', label: '4K (2160p)' },
  { value: '1080', label: '1080p' },
  { value: '720', label: '720p' },
  { value: '480', label: '480p' },
  { value: '360', label: '360p' },
] as const

export const VIDEO_FORMATS = [
  { value: '', label: 'Auto' },
  { value: 'mp4', label: 'MP4' },
  { value: 'webm', label: 'WebM' },
  { value: 'mkv', label: 'MKV' },
] as const

export const AUDIO_FORMATS = [
  { value: 'mp3', label: 'MP3' },
  { value: 'aac', label: 'AAC' },
  { value: 'flac', label: 'FLAC' },
  { value: 'opus', label: 'Opus' },
  { value: 'wav', label: 'WAV' },
] as const

export const AUDIO_QUALITIES = [
  { value: 0, label: 'Best (0)' },
  { value: 2, label: 'High (2)' },
  { value: 5, label: 'Medium (5)' },
  { value: 9, label: 'Low (9)' },
] as const

export const DEFAULTS_DOWNLOADS_OPTIONS: DownloadOptions = {
  mode: "single",
  resolution: "",
  videoFormat: "",
  audioOnly: false,
  audioFormat: "mp3",
  audioQuality: 0,
  noWatermark: false,
};