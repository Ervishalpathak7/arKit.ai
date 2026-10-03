package com.arkit.api.interceptors;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;

import org.junit.jupiter.api.Test;

import com.arkit.api.ratelimit.RateLimiter;

public class RateLimitingInterceptorTest {

    @Test
    void blockAfterLimitIsReached() {
        RateLimiter limiter = new RateLimiter(5, Duration.ofMinutes(10));
        for (int i = 0; i < 5; i++) {
            assertTrue(limiter.tryAcquire("1.2.3.4"));
        }
        assertFalse(limiter.tryAcquire("1.2.3.4"));
    }

    @Test
    void limitsAreIndependentPerIp() {
        RateLimiter limiter = new RateLimiter(5, Duration.ofMinutes(10));
        for (int i = 0; i < 5; i++) {
            assertTrue(limiter.tryAcquire("1.2.3.4"));
        }
        assertFalse(limiter.tryAcquire("1.2.3.4"));
        assertTrue(limiter.tryAcquire("1.2.3.5"));
    }
}
