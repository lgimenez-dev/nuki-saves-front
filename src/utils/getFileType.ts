export function getFileType(url: string): 'video' | 'image' | 'audio' | 'other' {
  const ext = url.split('.').pop()?.split('?')[0].toLowerCase() ?? ''
  if (['mp4', 'webm', 'mov', 'mkv'].includes(ext)) return 'video'
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image'
  if (['mp3', 'm4a', 'opus', 'ogg', 'flac', 'wav', 'aac'].includes(ext)) return 'audio'
  return 'other'
}
