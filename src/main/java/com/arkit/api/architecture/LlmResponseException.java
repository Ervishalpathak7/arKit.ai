package com.arkit.api.architecture;

public class LlmResponseException extends RuntimeException {
    public LlmResponseException(String message) {
        super(message);
    }
}
