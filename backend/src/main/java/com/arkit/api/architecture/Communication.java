package com.arkit.api.architecture;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Communication {
    SYNC, ASYNC;

    @JsonCreator
    public static Communication fromJson(String value) {
        if (value == null)
            return SYNC;
        try {
            return valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return SYNC;

        }
    }

    @JsonValue
    public String toJson() {
        return this.name();
    }
}