package com.arkit.api.generation.types;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum NodeType {
    CLIENT, CDN, LOAD_BALANCER, GATEWAY, PROXY, API_SERVER,
    WORKER, CACHE, DATABASE, STORAGE, QUEUE, EXTERNAL_SERVICE, OTHER;

    @JsonCreator
    public static NodeType fromJson(String value) {
        if (value == null)
            return OTHER;
        try {
            return valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return OTHER;

        }
    }

    @JsonValue
    public String toJson() {
        return this.name();
    }
}