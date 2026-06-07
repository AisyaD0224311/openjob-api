const cacheService = require('./cacheService');

/**
 * Middleware untuk caching GET requests
 * Menambahkan custom header X-Data-Source: cache ketika data berasal dari cache
 */
const cacheMiddleware = (cacheKeyFn) => {
  return async (req, res, next) => {
    try {
      // Hanya cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      const cacheKey = cacheKeyFn(req);

      // Coba ambil dari cache
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        // Data ditemukan di cache, kirim response dengan custom header
        res.set('X-Data-Source', 'cache');
        return res.json(cachedData);
      }

      // Data tidak ditemukan di cache, lanjutkan ke handler
      // Simpan cacheKey untuk digunakan oleh handler untuk menyimpan cache
      req.cacheKey = cacheKey;
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      // Jika ada error di cache, lanjutkan tanpa cache
      next();
    }
  };
};

/**
 * Helper untuk menyimpan response ke cache di dalam handler
 */
const setCacheResponse = async (cacheKey, data) => {
  if (cacheKey) {
    await cacheService.set(cacheKey, data);
  }
};

module.exports = {
  cacheMiddleware,
  setCacheResponse,
  cacheService
};
