import type { PlaylistItem } from '@/types/playlist.types'

export function parsePlaylistString(playlistString: string): PlaylistItem[] {
  if (!playlistString) return []

  const blocks = playlistString.split('|').map((b) => b.trim())
  const playlistItems: PlaylistItem[] = []

  for (const block of blocks) {
    if (!block) continue

    const colonIndex = block.indexOf(':')
    if (colonIndex === -1) continue

    const metaPart = block.substring(0, colonIndex).trim()
    const ayahPart = block.substring(colonIndex + 1).trim()

    const [rawSurah = '', rest1 = ''] = metaPart.split('%')
    const [riwayahId = '', rest2 = ''] = rest1.split('$')
    const [reciterId = '', rest3 = ''] = rest2.split('@')
    const [translationId = '', tafsirId = ''] = rest3.split('#')

    const ayahs: number[] = []
    for (const segment of ayahPart.split(',')) {
      const trimmed = segment.trim()
      if (!trimmed) continue

      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number)
        if (start && end && !isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (!ayahs.includes(i)) ayahs.push(i)
          }
        }
      } else {
        const num = Number(trimmed)
        if (!isNaN(num) && !ayahs.includes(num)) ayahs.push(num)
      }
    }

    playlistItems.push({
      surahNumber: Number(rawSurah.trim()) || 0,
      riwayahId: riwayahId.trim(),
      reciterId: reciterId.trim(),
      translationId: translationId.trim(),
      tafsirId: tafsirId.trim(),
      ayahs: ayahs.sort((a, b) => a - b),
    })
  }

  return playlistItems
}

export function encodeAyahArray(ayahs: number[]): string {
  if (!ayahs || ayahs.length === 0) return ''

  const sorted = [...new Set(ayahs)].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = sorted[0]!
  let prev = sorted[0]!

  for (let i = 1; i <= sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i]!
    } else {
      if (start === prev) {
        ranges.push(`${start}`)
      } else {
        ranges.push(`${start}-${prev}`)
      }
      start = sorted[i]!
      prev = sorted[i]!
    }
  }
  return ranges.join(',')
}

export function encodePlaylistString(items: PlaylistItem[]): string {
  return items
    .map((item) => {
      const ayahsStr = encodeAyahArray(item.ayahs)
      return `${item.surahNumber}%${item.riwayahId}$${item.reciterId}@${item.translationId}#${item.tafsirId}:${ayahsStr}`
    })
    .join(' | ')
}
