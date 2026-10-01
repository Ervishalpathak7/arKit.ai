package com.arkit.api.generation;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.boot.jackson.autoconfigure.JacksonProperties.Json;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arkit.api.generation.dto.GenerateArchitecturesRequest;
import com.arkit.api.generation.types.ArchitectureGraph;

import jakarta.validation.Valid;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/v1/architectures")
public class GenerationController {

    private final ObjectMapper objectMapper;

    GenerationController(ObjectMapper om) {
        this.objectMapper = om;
    }

    @PostMapping
    public ResponseEntity<ArchitectureGraph> CreateArchitecture(
            @Valid @RequestBody GenerateArchitecturesRequest req) {
        ArchitectureGraph graph = hardcodedGraph();
        return ResponseEntity.ok(graph);
    }

    private ArchitectureGraph hardcodedGraph() {
        try (InputStream in = getClass().getResourceAsStream("/samples/url-shortener.json")) {
            return objectMapper.readValue(in, ArchitectureGraph.class);
        } catch (IOException e) {
            throw new IllegalStateException("sample graph missing", e);
        }
    }

}
