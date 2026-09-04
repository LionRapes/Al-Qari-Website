export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token')
}

export const getUserId = (): string | null => {
  return localStorage.getItem('user_id')
}

export const isAuth = (): boolean => {
  return Boolean(getAuthToken() && getUserId())
}

export const getAuth = (): { token: string; userId: string } | null => {
  const token = getAuthToken()
  const userId = getUserId()

  if (token && userId) {
    return { token, userId }
  }

  return null
}

export const getAuthHeaders = (isFormData: boolean = false): HeadersInit => {
  const token = getAuthToken()
  const headers: Record<string, string> = {}

  if (token) headers['X-Auth-Token'] = token
  if (!isFormData) headers['Content-Type'] = 'application/json'

  return headers
}

export const clearAuthSession = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user_id')
}

export const handleApiError = (res: Response, errorMessage: string) => {
  if (!res.ok) {
    if (res.status === 401) {
      clearAuthSession()
    }
    throw new Error(errorMessage)
  }
}
