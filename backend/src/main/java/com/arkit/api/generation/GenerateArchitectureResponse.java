package com.arkit.api.generation;

import java.util.UUID;

import com.arkit.api.architecture.ArchitectureGraph;

public record GenerateArchitectureResponse(
        UUID id,
        String description,
        ArchitectureGraph graph) {
    static GenerateArchitectureResponse from(Generation generation) {
        return new GenerateArchitectureResponse(generation.getId(), generation.getDescription(), generation.getGraph());
    }

}
