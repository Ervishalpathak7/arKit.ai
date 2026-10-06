package com.arkit.api.architecture;

import java.util.List;

public record ArchitectureGraph(
                List<Node> nodes,
                List<Edge> edges) {
        public ArchitectureGraph {
                nodes = nodes == null ? List.of() : nodes;
                edges = edges == null ? List.of() : edges;
        }
}
