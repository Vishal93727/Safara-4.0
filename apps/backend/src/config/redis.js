import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis retry attempts exhausted');
        return new Error('Retry attempts exhausted');
      }
      return Math.min(retries * 100, 3000); // delay in ms
    }
  }
});

// Connect only if not already open
// (async () => {
//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//       logger.info('Connected to Redis');
//     }
//   } catch (err) {
//     logger.error('Redis connection failed:', err);
//   }
// })();

// Error handling
redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

// Helper to set cache with JSON and TTL
export const setCache = async (key, value, ttl = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    logger.error(`Error setting cache for key ${key}:`, err);
  }
};

// Helper to get cache and parse JSON
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error(`Error getting cache for key ${key}:`, err);
    return null;
  }
};

// Optional helper to delete cache
export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error(`Error deleting cache for key ${key}:`, err);
  }
};