/**
 * In-memory sliding window rate limiter
 * @param {string} key - Unique identifier (e.g., user ID or IP address)
 * @param {number} limit - Number of allowed requests
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{allowed: boolean, remaining: number, resetTime: number}>}
 */
const rateLimitMap = new Map();

export const checkLimit = async (key, limit, windowMs) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }

  // Filter timestamps within current window
  const timestamps = rateLimitMap.get(key).filter((ts) => ts > windowStart);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const resetTime = oldest + windowMs;
    rateLimitMap.set(key, timestamps);
    return { allowed: false, remaining: 0, resetTime };
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);

  const remaining = limit - timestamps.length;
  const resetTime = now + windowMs;

  return { allowed: true, remaining, resetTime };
};

/**
 * Parse rate limit config from .env format
 * @param {string} configString - Format: "attempts:minutes" (e.g., "5:15")
 * @returns {{limit: number, windowMs: number}}
 */
export const parseRateLimitConfig = (configString) => {
  if (!configString) {
    throw new Error("Rate limit config is required");
  }

  const [attempts, minutes] = configString.split(":");
  const limit = parseInt(attempts);
  const windowMs = parseInt(minutes) * 60 * 1000;

  if (isNaN(limit) || isNaN(windowMs) || limit <= 0 || windowMs <= 0) {
    throw new Error(
      `Invalid rate limit config: ${configString}. Expected format: "attempts:minutes"`
    );
  }

  return { limit, windowMs };
};
