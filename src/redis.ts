import redis, { RedisClient } from 'redis';
const redisClient: RedisClient = redis.createClient();

export default redisClient