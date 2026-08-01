import { useState } from 'react'
import './App.css'
import { API_BASE, RESOLUTIONS, VIDEO_FORMATS, AUDIO_FORMATS, AUDIO_QUALITIES } from './constants'
import type { DownloadMode } from './types'
import { useDownloadOptions } from './hooks/useDownloadOptions'
import { useDownloadJob } from './hooks/useDownloadJob'
import { getFileType } from './utils/getFileType'
import { useBlobUrl } from './hooks/useBlobUrl'
import pictureCrash from './assets/picture_crash.svg'

export default function App() {
  const [url, setUrl] = useState('')
  const options = useDownloadOptions()
  const { opts, set } = options
  const job = useDownloadJob(opts.mode)

  const busy = job.phase === 'submitting' || job.phase === 'polling'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url.trim()) return
    job.submit(options.buildBody(url.trim()))
  }

  const handleReset = () => {
    job.reset()
    options.reset()
    setUrl('')
  }

  const fileUrl = job.result ? `${API_BASE}${job.result.downloadUrl}` : null
  const thumbSrc = job.result?.thumbnailUrl ? `${API_BASE}${job.result.thumbnailUrl}` : null
  const fileType = fileUrl ? getFileType(fileUrl) : 'other'

  const thumbBlob = useBlobUrl(thumbSrc)
  const imageBlob = useBlobUrl(fileType === 'image' ? fileUrl : null)
  return (
    <main>
      <img src="/favicon.svg" alt="Logo" className="app-logo" />
      <h1>NukiSaves</h1>
      <p className="platforms">TikTok · Instagram · Twitter/X · Facebook · YouTube</p>

      <form id="download-form" onSubmit={handleSubmit} className="url-form">
        <input
          type="url"
          placeholder="Paste video URL here…"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={busy}
          required
        />
      </form>

      <div className="options-panel">
        <div className="options-row">
          <label className="option-field">
            <span>Mode</span>
            <select
              value={opts.mode}
              onChange={e => set('mode', e.target.value as DownloadMode)}
              disabled={busy}
            >
              <option value="single">Single</option>
              <option value="multiple">Playlist / Album</option>
            </select>
          </label>
        </div>

        <div className="options-row">
          <label className="option-field">
            <span>Resolution</span>
            <select
              value={opts.resolution}
              onChange={e => set('resolution', e.target.value)}
              disabled={busy || opts.audioOnly || opts.mode === 'multiple'}
            >
              {RESOLUTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </label>
          <label className="option-field">
            <span>Format</span>
            <select
              value={opts.videoFormat}
              onChange={e => set('videoFormat', e.target.value)}
              disabled={busy || opts.audioOnly || opts.mode === 'multiple'}
            >
              {VIDEO_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </label>
        </div>

        <div className="options-row options-checks">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={opts.audioOnly}
              onChange={e => set('audioOnly', e.target.checked)}
              disabled={busy}
            />
            Audio only
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={opts.noWatermark}
              onChange={e => set('noWatermark', e.target.checked)}
              disabled={busy || opts.mode === 'multiple'}
            />
            No watermark
          </label>
        </div>

        {opts.audioOnly && (
          <div className="options-row">
            <label className="option-field">
              <span>Format</span>
              <select
                value={opts.audioFormat}
                onChange={e => set('audioFormat', e.target.value)}
                disabled={busy}
              >
                {AUDIO_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </label>
            <label className="option-field">
              <span>Quality</span>
              <select
                value={opts.audioQuality}
                onChange={e => set('audioQuality', Number(e.target.value))}
                disabled={busy}
              >
                {AUDIO_QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
              </select>
            </label>
          </div>
        )}
      </div>

      {busy && (
        <p className="status-msg">
          {job.phase === 'submitting' ? 'Sending request…' : 'Waiting for download to complete…'}
        </p>
      )}

      {job.phase === 'polling' && (
        <div className="cancel-row">
          <button onClick={job.cancel} className="cancel-btn">Cancel</button>
        </div>
      )}

      {job.phase === 'failed' && job.error && (
        <div className="error-box" role="alert">
          <p>{job.error}</p>
          <button onClick={handleReset}>Try again</button>
        </div>
      )}

      <button
        type="submit"
        form="download-form"
        disabled={busy || !url.trim()}
        className="submit-btn"
      >
        {busy ? 'Processing…' : 'Search'}
      </button>

      {job.phase === 'done' && fileUrl && (
        <div className="result-box">
          {fileType === 'video' || fileType === 'audio' && <img src={thumbBlob ?? pictureCrash} alt="Preview" className="image-thumbnail" />}
          {fileType === 'image' && <img src={imageBlob ?? pictureCrash} alt="Preview" className="image-thumbnail" />}
          {fileType === 'other' && imageBlob && (<img src={imageBlob ?? pictureCrash} alt="Thumbnail" className="image-thumbnail" />)}
          <div className="result-actions">
            <a href={fileUrl} download>
              <button>Download file</button>
            </a>
            <button onClick={handleReset}>Download another</button>
          </div>
        </div>
      )}
    </main>
  )
}
