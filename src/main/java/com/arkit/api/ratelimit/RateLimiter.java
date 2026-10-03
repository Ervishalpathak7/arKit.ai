package com.arkit.api.ratelimit;

import java.util.ArrayDeque;
import java.time.Duration;
import java.time.Instant;
import java.util.Deque;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Component
public class RateLimiter {
    private final int maxRequest;
    private final Duration window;
    private final Cache<String, Deque<Instant>> requests;

    public RateLimiter(@Value("${ratelimit.max-request:15}") int maxRequest,
            @Value("${ratelimit.window:PT10M}") Duration window) {
        this.maxRequest = maxRequest;
        this.window = window;
        this.requests = Caffeine.newBuilder().expireAfterAccess(window)
                .maximumSize(100_000).build();
    }

    /**
     * @return true if the request is allowed , false if the caller is over the
     *         limit
     */
    public boolean tryAcquire(String clientIp) {
        Instant now = Instant.now();
        Instant cutoff = now.minus(window);
        boolean[] allowed = new boolean[1];

        requests.asMap().compute(clientIp, (key, timestamps) -> {
            if (timestamps == null) {
                timestamps = new ArrayDeque<>();
            }
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.pollFirst();
            }
            allowed[0] = timestamps.size() < maxRequest;
            if (allowed[0]) {
                timestamps.addLast(now);
            }

            return timestamps;
        });
        return allowed[0];
    }

    /**
     * @return seconds until the oldest request in the window expires
     */
    public long retryAfterSeconds(String clientIp) {
        Deque<Instant> timeStamps = requests.getIfPresent(clientIp);
        if (timeStamps == null)
            return 0;
        Instant oldest = timeStamps.peekFirst();
        if (oldest == null)
            return 0;
        long seconds = Duration.between(Instant.now(), oldest.plus(window)).toSeconds();
        return Math.max(seconds, 1);
    }

}
