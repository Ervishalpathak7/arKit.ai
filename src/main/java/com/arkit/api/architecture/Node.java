package com.arkit.api.architecture;

public record Node(
                String id,
                String label,
                NodeType type,
                Layer layer,
                String description) {
}
