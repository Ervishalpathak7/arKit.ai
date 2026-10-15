package com.arkit.api.architecture;

public record Node(
                String id,
                String label,
                String technology,
                NodeType type,
                Layer layer,
                String description) {
}
