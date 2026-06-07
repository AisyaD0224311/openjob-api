const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log('Gagal terhubung ke Redis setelah 10 kali percobaan');
        return new Error('Redis reconnect strategy has been exhausted');
      }
      return retries * 50;
    }
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Berhasil terhubung ke Redis');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis sedang mencoba reconnect...');
});

// Pastikan client terhubung
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Gagal menghubungkan ke Redis:', err);
  }
})();

module.exports = redisClient;
