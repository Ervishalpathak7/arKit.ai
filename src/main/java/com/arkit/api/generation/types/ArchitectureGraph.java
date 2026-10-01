package com.arkit.api.generation.types;

import java.util.List;

public record ArchitectureGraph(
        List<Node> nodes,
        List<Edge> edges) {
}
