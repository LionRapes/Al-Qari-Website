const CACHE_NAME = 'al-qari-data'
const CACHE_TTL = 30 * 60 * 1000

export const cacheService = {
  async fetchCached(url: string) {
    try {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(url)

      if (cachedResponse) {
        const wrapper = await cachedResponse.json()
        const now = Date.now()

        if (wrapper && wrapper.createdAt && now - wrapper.createdAt < CACHE_TTL) {
          return wrapper.data
        }
      }

      const networkResponse = await fetch(url)
      if (networkResponse.ok) {
        const data = await networkResponse.json()

        const wrapper = {
          createdAt: Date.now(),
          data: data,
        }

        const responseToCache = new Response(JSON.stringify(wrapper), {
          headers: { 'Content-Type': 'application/json' },
        })
        cache.put(url, responseToCache)

        return data
      }

      const errorRes = await fetch(url)
      return await errorRes.json()
    } catch (error) {
      console.warn('Cache API failed, falling back to network:', error)
      const res = await fetch(url)
      return await res.json()
    }
  },

  async peekCached<T>(url: string): Promise<T | null> {
    try {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(url)

      if (!cachedResponse) return null

      const wrapper = await cachedResponse.json()
      const now = Date.now()

      if (wrapper && wrapper.createdAt && now - wrapper.createdAt < CACHE_TTL) {
        return wrapper.data as T
      }

      await cache.delete(url)
      return null
    } catch (error) {
      console.warn('Failed to peek cache:', error)
      return null
    }
  },
}
