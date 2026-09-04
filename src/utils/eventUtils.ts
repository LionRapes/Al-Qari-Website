type EVENTS = {
  USER_PROFILE_UPDATED: 'user-profile-updated'
  PLAYLIST_UPDATED: 'playlist-updated'
}

export const emitEvent = (e: keyof EVENTS) => {
  window.dispatchEvent(new CustomEvent(e))
}

export const onEvent = (e: keyof EVENTS, callback: EventListener) => {
  window.addEventListener(e, callback)
}

export const offEvent = (e: keyof EVENTS, callback: EventListener) => {
  window.removeEventListener(e, callback)
}
