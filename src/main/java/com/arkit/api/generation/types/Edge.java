package com.arkit.api.generation.types;

public record Edge(
        String from,
        String to,
        String label,
        String protocol,
        Direction direction,
        Communication communication) {
}
