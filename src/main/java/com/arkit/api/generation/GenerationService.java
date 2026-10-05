package com.arkit.api.generation;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.arkit.api.architecture.ArchitectureGraph;
import com.arkit.api.architecture.ArchitectureParser;
import com.arkit.api.architecture.GraphValidator;
import com.arkit.api.llm.LlmClient;

@Service
public class GenerationService {
    private final GraphValidator validator;
    private final ArchitectureParser parser;
    private final LlmClient llmClient;
    private final String systemPrompt;
    private final GenerationRepository repository;

    GenerationService(GraphValidator validator, ArchitectureParser parser, LlmClient llmClient,
            GenerationRepository repository,
            @Value("classpath:prompts/hld-system-v1.txt") Resource promptFile) throws IOException {
        this.validator = validator;
        this.parser = parser;
        this.llmClient = llmClient;
        this.systemPrompt = promptFile.getContentAsString(StandardCharsets.UTF_8);
        this.repository = repository;
    }

    public Generation GenerateArchitecture(String description) {
        String hashDescription = hash(description);
        Optional<Generation> cached = repository.findByDescriptionHash(hashDescription);
        if (cached.isPresent()) {
            return cached.get();
        }

        String response = llmClient.generate(systemPrompt, description);
        ArchitectureGraph validated = validator.validate(parser.parse(response));
        Generation generation = new Generation(description, hashDescription, validated);
        try {
            return repository.save(generation);
        } catch (DataIntegrityViolationException e) {
            return repository.findByDescriptionHash(hashDescription).orElseThrow();
        }
    }

    private String hash(String description) {
        String normalised = description.trim().toLowerCase();
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(normalised.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(64);
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

}
