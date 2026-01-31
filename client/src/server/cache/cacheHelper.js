const CACHE_NAME = "static-cache-v1";

/**
 * Cache static assets
 */
export async function cacheStaticAssets(assets) {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(assets);
}

/**
 * Fetch from cache first, then network fallback
 */
export async function fetchCachedRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  return cachedResponse || fetch(request);
}

/**
 * Clear old caches
 */
export async function clearOldCaches() {
  const keys = await caches.keys();
  return Promise.all(
    keys
      .filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key))
  );
}
