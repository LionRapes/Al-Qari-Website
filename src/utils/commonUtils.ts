import type { ComposerTranslation, Composer } from 'vue-i18n'

export function translateOrOriginal(
  key: string,
  t: ComposerTranslation,
  te: Composer['te'],
): string {
  return te(key) ? t(key) : key
}

export const formatDate = (timestamp: number, level: 'short' | 'full' = 'short') => {
  const date = new Date(timestamp / 1000)

  const formats = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    full: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  } as const

  return date.toLocaleDateString(undefined, formats[level])
}
