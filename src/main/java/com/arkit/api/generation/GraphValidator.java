package com.arkit.api.generation;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.arkit.api.generation.types.ArchitectureGraph;
import com.arkit.api.generation.types.Edge;

@Component
public class GraphValidator {
    private static final Logger log = LoggerFactory.getLogger(GraphValidator.class);

    ArchitectureGraph validate(ArchitectureGraph graph) {
        Set<String> ids = graph.nodes().stream().map(node -> node.id()).collect(Collectors.toSet());
        List<Edge> filterEdges = graph.edges().stream()
                .filter(edge -> ids.contains(edge.from()) && ids.contains(edge.to())).toList();
        int droppedEdges = graph.edges().size() - filterEdges.size();
        if (droppedEdges > 0) {
            log.warn("Dropped {} edges referencing unknown node ids", droppedEdges);
        }
        return new ArchitectureGraph(graph.nodes(), filterEdges);
    }

}
