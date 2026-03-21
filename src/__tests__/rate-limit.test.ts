import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('allows requests under the limit', () => {
    const result = rateLimit({ key: 'user-1', limit: 3, windowMs: 10_000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('blocks requests over the limit', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit({ key: 'user-block', limit: 3, windowMs: 10_000 });
    }
    const result = rateLimit({ key: 'user-block', limit: 3, windowMs: 10_000 });
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after the window expires', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit({ key: 'user-reset', limit: 3, windowMs: 5_000 });
    }
    vi.advanceTimersByTime(6_000);
    const result = rateLimit({ key: 'user-reset', limit: 3, windowMs: 5_000 });
    expect(result.success).toBe(true);
  });

  it('tracks different keys independently', () => {
    rateLimit({ key: 'a', limit: 1, windowMs: 10_000 });
    rateLimit({ key: 'a', limit: 1, windowMs: 10_000 });
    const resultA = rateLimit({ key: 'a', limit: 1, windowMs: 10_000 });
    const resultB = rateLimit({ key: 'b', limit: 1, windowMs: 10_000 });
    expect(resultA.success).toBe(false);
    expect(resultB.success).toBe(true);
  });
});
