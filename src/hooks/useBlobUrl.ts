import { useState, useEffect } from 'react'

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

function mimeFromUrl(url: string): string {
  const ext = url.split('.').pop()?.split('?')[0].toLowerCase() ?? ''
  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

export function useBlobUrl(remoteUrl: string | null): string | null {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!remoteUrl) {
      setBlobUrl(null)
      return
    }

    let active = true
    let objectUrl: string | null = null

    fetch(remoteUrl)
      .then(r => r.blob())
      .then(blob => {
        if (!active) return
        // Force correct MIME if server sends application/octet-stream
        const mime = blob.type && blob.type !== 'application/octet-stream'
          ? blob.type
          : mimeFromUrl(remoteUrl)
        const typed = blob.type !== mime ? new Blob([blob], { type: mime }) : blob
        objectUrl = URL.createObjectURL(typed)
        setBlobUrl(objectUrl)
      })
      .catch(() => {})

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [remoteUrl])

  return blobUrl
}
