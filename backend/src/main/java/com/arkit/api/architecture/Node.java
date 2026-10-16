package com.arkit.api.architecture;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Node(
                String id,
                String label,
                String technology,
                NodeType type,
                Layer layer,
                String description) {
}
