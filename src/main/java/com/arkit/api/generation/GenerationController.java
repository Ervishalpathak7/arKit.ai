package com.arkit.api.generation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arkit.api.architecture.ArchitectureGraph;

import jakarta.validation.Valid;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/v1/architectures")
public class GenerationController {

    private final GenerationService service;

    GenerationController(ObjectMapper om, GenerationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ArchitectureGraph> CreateArchitecture(
            @Valid @RequestBody GenerateArchitecturesRequest req) {
        ArchitectureGraph graph = service.GenerateArchitecture(req.description());
        return ResponseEntity.ok(graph);
    }
}
