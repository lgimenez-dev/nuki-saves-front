# Nuki Saves

Web interface for downloading content from social media platforms. Consumes the REST API from the [Express backend](../smedia-downloader).

---

## Stack

| | |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styles | Water.css + custom CSS |
| Global state | Zustand (with `persist` to resume downloads after page refresh) |

---

## Supported platforms

### Single download (`mode: single`)

| Platform | Video | Audio | No watermark |
|---|---|---|---|
| YouTube | ✓ | ✓ | — |
| TikTok | ✓ | ✓ | ✓ |
| Instagram | ✓ | ✓ | — |
| Twitter / X | ✓ | ✓ | — |
| Facebook | ✓ | ✓ | — |

### Playlist / Album (`mode: multiple`) → ZIP

- YouTube Playlists
- YouTube Music
- SoundCloud Sets
- Bandcamp Albums

---

## Download options

| Option | Applies to | Values |
|---|---|---|
| Resolution | Video (single) | Best / 4K / 1080p / 720p / 480p / 360p |
| Video format | Video (single) | Auto / MP4 / WebM / MKV / MOV |
| Audio only | Single and multiple | MP3 / AAC / FLAC / Opus / WAV |
| Audio quality | Audio only | Best (0) → Low (9) |
| No watermark | Single (TikTok) | on / off |

---

## Features

- URL input + Download button
- Automatic job status polling (4 s for single, 60 s for multiple)
- Polling resumes after page refresh (jobId persisted in `localStorage` via Zustand)
- Thumbnail preview and video/audio player on completion
- Direct download button for the resulting file
- Job cancellation while in progress (`DELETE /download/:jobId`)
- Clear error messages for 400, 404, 409, and 429 responses

---

## Environment variables

```env
VITE_API_URL=http://localhost:3000
```

Defaults to `http://localhost:3000` if not set.

---

## Development

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`. Configure CORS on the backend:

```env
FRONTEND_ORIGIN=http://localhost:5173
```

---

## Project structure

```
src/
  constants.ts              # API_BASE, POLL_INTERVAL, select option arrays
  types.ts                  # All types and interfaces (DownloadMode, Phase, etc.)
  App.tsx                   # Root component
  App.css                   # Styles
  services/
    api.ts                  # Typed fetch functions (postDownload, getStatus, deleteDownload)
  hooks/
    useDownloadJob.ts       # Job lifecycle: submit, polling, cancel, reset
    useDownloadOptions.ts   # Form options state + buildBody()
    useBlobUrl.ts           # Converts remote URL to blob URL (for image preview)
  store/
    jobStore.ts             # Persisted Zustand store: jobId + mode
  utils/
    getFileType.ts          # File type detection by extension
```
