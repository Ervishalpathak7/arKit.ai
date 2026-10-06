package com.arkit.api.exception;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException e) {
        List<ApiError.FieldError> fields = e.getBindingResult().getFieldErrors().stream()
                .map(err -> new ApiError.FieldError(err.getField(), err.getDefaultMessage()))
                .toList();
        return ResponseEntity.badRequest()
                .body(new ApiError("VALIDATION_FAILED", "Request validation failed", fields));
    }

    @ExceptionHandler(HttpClientErrorException.TooManyRequests.class)
    ResponseEntity<ApiError> handleRateLimit(HttpClientErrorException.TooManyRequests e) {
        return ResponseEntity.status(429)
        .body(new ApiError("LLM_RATE_LIMITED", "Too many requests. Try again shortly.", null));
    }
    
    @ExceptionHandler(ResourceAccessException.class)
    ResponseEntity<ApiError> handleTimeout(ResourceAccessException e) {
        log.error("LLM request failed", e);
        return ResponseEntity.status(504).body(new ApiError("LLM_TIMEOUT", "Generation took too long.", null));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> handleUnhandledException(Exception ex) {
        log.error("Unhandled Exception : " + ex);
        return ResponseEntity.internalServerError()
                .body(new ApiError("INTERNAL_SERVER_ERROR", "something went wrong", null));
    }

}
