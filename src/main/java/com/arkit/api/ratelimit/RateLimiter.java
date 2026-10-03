package com.arkit.api.ratelimit;

import java.util.ArrayDeque;
import java.time.Duration;
import java.time.Instant;
import java.util.Deque;

import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Component
public class RateLimiter {
    private static final int MAX_REQUEST = 10;
    private static final Duration WINDOW = Duration.ofMinutes(10);

    private final Cache<String, Deque<Instant>> requests = Caffeine.newBuilder().expireAfterAccess(WINDOW)
            .maximumSize(100_000).build();

    /**
     * @return true if the request is allowed , false if the caller is over the
     *         limit
     */
    public boolean tryAcuire(String clientIp) {
        Instant now = Instant.now();
        Instant cutoff = now.minus(WINDOW);
        boolean[] allowed = new boolean[1];

        requests.asMap().compute(clientIp, (key, timestamps) -> {
            if (timestamps == null) {
                timestamps = new ArrayDeque<>();
            }
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.pollFirst();
            }
            allowed[0] = timestamps.size() < MAX_REQUEST;
            if (allowed[0]) {
                timestamps.addLast(Instant.now());
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
        long seconds = Duration.between(Instant.now(), oldest.plus(WINDOW)).toSeconds();
        return Math.max(seconds, 1);
    }

}
