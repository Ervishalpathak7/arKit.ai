package com.arkit.api.generation.exceptions;

public class LlmResponseException extends RuntimeException {
    public LlmResponseException(String message) {
        super(message);
    }
}
