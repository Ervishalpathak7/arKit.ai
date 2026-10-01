package com.arkit.api.generation.types;

public record Node(
        String id,
        String label,
        NodeType type,
        Layer layer,
        String description) {
}
