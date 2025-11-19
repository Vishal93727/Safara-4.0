// utils/redis.js
import { createClient } from 'redis';
import { logger } from './logger.js';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.connect()
  .then(() => logger.info('Connected to Redis'))
  .catch((err) => logger.error('Redis connection failed:', err));

redisClient.on('error', (err) => logger.error('Redis error:', err));

export const setCache = async (key, value, ttl = 3600) => {
  try {
    // Convert Mongoose doc to plain JS object
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    logger.error(`Redis setCache error for key ${key}:`, err);
  }
};

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error(`Redis getCache error for key ${key}:`, err);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error(`Redis deleteCache error for key ${key}:`, err);
  }
};