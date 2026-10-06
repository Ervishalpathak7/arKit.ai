package com.arkit.api.ratelimit;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;

import org.junit.jupiter.api.Test;


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

    @Test
    void collapsesIpv6ToSlash64() {
        RateLimiter limiter = new RateLimiter(3, Duration.ofMinutes(10));
        assertTrue(limiter.tryAcquire("2401:4900:1c5e:d236::1"));
        assertTrue(limiter.tryAcquire("2401:4900:1c5e:d236:beec:a0ff:fe12:5ddd"));
        assertTrue(limiter.tryAcquire("2401:4900:1c5e:d236:ffff:ffff:ffff:ffff"));
        assertFalse(limiter.tryAcquire("2401:4900:1c5e:d236::1"));
        assertTrue(limiter.tryAcquire("2401:4900:1c5e:d237::1"));
        assertTrue(limiter.tryAcquire("203.0.113.5"));
    }
}
