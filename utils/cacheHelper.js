// In-memory cache for offline support
const cache = new Map();

export const setCache = (key, data, ttl = 3600000) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

export const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

export const getAllCache = () => {
  const result = {};
  for (const [key, value] of cache) {
    if (Date.now() - value.timestamp <= value.ttl) {
      result[key] = value.data;
    }
  }
  return result;
};