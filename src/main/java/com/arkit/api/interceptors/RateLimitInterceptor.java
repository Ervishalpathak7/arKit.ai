package com.arkit.api.interceptors;

import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.HandlerInterceptor;

import com.arkit.api.ratelimit.RateLimiter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    private final RateLimiter rateLimiter;

    RateLimitInterceptor(RateLimiter rateLimiter) {
        this.rateLimiter = rateLimiter;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String clientIp = resolveClientIp(request);
        if (!rateLimiter.tryAcquire(clientIp)) {
            long seconds = rateLimiter.retryAfterSeconds(clientIp);
            response.addHeader(HttpHeaders.RETRY_AFTER, Long.toString(seconds));
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter()
                    .write("{\"code\":\"RATE_LIMITED\",\"message\":\"Too many requests. Try again later.\"}");

            return false;
        }
        return true;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String cfIp = request.getHeader("CF-Connecting-IP");
        return (cfIp != null && !cfIp.isBlank()) ? cfIp : request.getRemoteAddr();

    }
}
