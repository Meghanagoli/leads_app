import { NextRequest } from 'next/server';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.options.windowMs;
    
    // Clean up expired entries
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime < now) {
        this.requests.delete(key);
      }
    }

    const current = this.requests.get(identifier);
    
    if (!current) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.options.windowMs,
      });
      return true;
    }

    if (current.resetTime < now) {
      // Window has expired, reset
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.options.windowMs,
      });
      return true;
    }

    if (current.count >= this.options.maxRequests) {
      return false;
    }

    current.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const current = this.requests.get(identifier);
    if (!current) return 0;
    
    const now = Date.now();
    return Math.max(0, current.resetTime - now);
  }
}

// Create rate limiters for different endpoints
export const createBuyerRateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
});

export const updateBuyerRateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute
});

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export function checkRateLimit(
  request: NextRequest,
  rateLimiter: RateLimiter,
  identifier?: string
): { allowed: boolean; remainingTime?: number } {
  const clientIP = getClientIP(request);
  const id = identifier || clientIP;
  
  const allowed = rateLimiter.isAllowed(id);
  
  if (!allowed) {
    const remainingTime = rateLimiter.getRemainingTime(id);
    return { allowed: false, remainingTime };
  }
  
  return { allowed: true };
}
