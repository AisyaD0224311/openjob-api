const redisClient = require('./redisClient');

const CACHE_EXPIRATION = 60 * 60; // 1 jam dalam detik

class CacheService {
  async get(key) {
    try {
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  async set(key, value, expiration = CACHE_EXPIRATION) {
    try {
      await redisClient.setEx(key, expiration, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error);
    }
  }

  async delete(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error);
    }
  }

  async deletePattern(pattern) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(`Error deleting cache pattern ${pattern}:`, error);
    }
  }

  // Generate cache key untuk companies/:id
  getCompanyCacheKey(companyId) {
    return `company:${companyId}`;
  }

  // Generate cache key untuk users/:id
  getUserCacheKey(userId) {
    return `user:${userId}`;
  }

  // Generate cache key untuk applications/:id
  getApplicationCacheKey(applicationId) {
    return `application:${applicationId}`;
  }

  // Generate cache key untuk applications/user/:userId
  getApplicationsByUserCacheKey(userId) {
    return `applications:user:${userId}`;
  }

  // Generate cache key untuk applications/job/:jobId
  getApplicationsByJobCacheKey(jobId) {
    return `applications:job:${jobId}`;
  }

  // Generate cache key untuk bookmarks
  getBookmarksCacheKey(userId) {
    return `bookmarks:${userId}`;
  }
}

module.exports = new CacheService();
