package com.arkit.api.generation.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Direction {
    ONE_WAY, BIDIRECTIONAL;

    @JsonCreator
    public static Direction fromJson(String value) {
        if (value == null)
            return BIDIRECTIONAL;
        try {
            return valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return BIDIRECTIONAL;

        }
    }

    @JsonValue
    public String toJson() {
        return this.name();
    }
}
