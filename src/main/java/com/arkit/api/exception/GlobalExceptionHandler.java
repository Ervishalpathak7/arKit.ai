package com.arkit.api.exception;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors(null).stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage()).collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new ApiError("VAlIDATION_FAILED", message));

    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> handleUnhandledException(Exception ex) {
        System.out.println("Unhandled Exception : " + ex);
        return ResponseEntity.internalServerError().body(new ApiError("INTERNAL_SERVER_ERROR", "something went wrong"));
    }

}
