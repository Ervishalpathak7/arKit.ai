package com.arkit.api.generation.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Layer {
    CLIENT, EDGE, APPLICATION, DATA, EXTERNAL;

    @JsonCreator
    public static Layer fromJson(String value) {
        if (value == null)
            return APPLICATION;
        try {
            return valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return APPLICATION;

        }
    }

    @JsonValue
    public String toJson() {
        return this.name();
    }
}
