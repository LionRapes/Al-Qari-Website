import { getAuthHeaders } from '@/utils/authUtils'

const CACHE_NAME = 'al-qari-data'
const DEFAULT_CACHE_TTL = 30 * 60 * 1000

export const cacheService = {
  async fetchCached(url: string, ttl: number = DEFAULT_CACHE_TTL) {
    try {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(url)

      if (cachedResponse) {
        const wrapper = await cachedResponse.json()
        const now = Date.now()

        const entryTtl = wrapper.ttl || DEFAULT_CACHE_TTL

        if (wrapper && wrapper.createdAt && now - wrapper.createdAt < entryTtl) {
          return wrapper.data
        }
      }

      const networkResponse = await fetch(url, {
        headers: getAuthHeaders(),
      })
      if (networkResponse.ok) {
        const contentType = networkResponse.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.log(networkResponse)

          throw new TypeError("It's not JSON!")
        }

        const data = await networkResponse.json()

        const wrapper = {
          createdAt: Date.now(),
          ttl: ttl,
          data: data,
        }

        const responseToCache = new Response(JSON.stringify(wrapper), {
          headers: { 'Content-Type': 'application/json' },
        })
        cache.put(url, responseToCache)

        return data
      }

      const errorRes = await fetch(url, {
        headers: getAuthHeaders(),
      })

      const contentType = errorRes.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("It's not JSON!")
      }

      return await errorRes.json()
    } catch (error) {
      console.warn('Cache API failed, falling back to network:', error)
      const res = await fetch(url, {
        headers: getAuthHeaders(),
      })
      return await res.json()
    }
  },

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = DEFAULT_CACHE_TTL,
  ): Promise<T> {
    const cachedData = await this.getCache<T>(key)

    if (cachedData !== null) {
      return cachedData
    }

    const newData = await fetcher()
    await this.setCache(key, newData, ttl)

    return newData
  },

  async getCache<T>(url: string): Promise<T | null> {
    try {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(url)

      if (!cachedResponse) return null

      const wrapper = await cachedResponse.json()
      const now = Date.now()

      const entryTtl = wrapper.ttl || DEFAULT_CACHE_TTL

      if (wrapper && wrapper.createdAt && now - wrapper.createdAt < entryTtl) {
        return wrapper.data as T
      }

      await cache.delete(url)
      return null
    } catch (error) {
      console.warn('Failed to peek cache:', error)
      return null
    }
  },

  async setCache<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL): Promise<void> {
    try {
      const cache = await caches.open(CACHE_NAME)

      const wrapper = {
        createdAt: Date.now(),
        ttl: ttl,
        data: data,
      }

      const responseToCache = new Response(JSON.stringify(wrapper), {
        headers: { 'Content-Type': 'application/json' },
      })

      await cache.put(key, responseToCache)
    } catch (error) {
      console.warn('Failed to set cache manually:', error)
    }
  },

  async deleteCache(key: string): Promise<boolean> {
    try {
      const cache = await caches.open(CACHE_NAME)
      return await cache.delete(key)
    } catch (error) {
      console.warn('Failed to delete cache manually:', error)
      return false
    }
  },

  async updateCache<T>(
    key: string,
    updater: (cachedData: T) => T,
    ttl: number = DEFAULT_CACHE_TTL,
  ): Promise<boolean> {
    const cachedData = await this.getCache<T>(key)
    if (cachedData !== null) {
      const updatedData = updater(cachedData)
      await this.setCache(key, updatedData, ttl)
      return true
    }

    return false
  },
}
