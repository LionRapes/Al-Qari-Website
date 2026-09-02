export type EmailValidationError = 'required' | 'invalid' | null

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NICKNAME_REGEX = /^[a-zA-Z0-9_-]+$/

export const validateEmail = (value: string): EmailValidationError => {
  const trimmed = value.trim()
  if (!trimmed) return 'required'
  if (!EMAIL_REGEX.test(trimmed)) return 'invalid'
  return null
}

export const validateNickname = (value: string): boolean => {
  return NICKNAME_REGEX.test(value)
}
