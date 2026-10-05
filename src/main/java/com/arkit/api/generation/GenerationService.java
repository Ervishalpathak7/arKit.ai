package com.arkit.api.generation;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.arkit.api.architecture.ArchitectureGraph;
import com.arkit.api.architecture.ArchitectureParser;
import com.arkit.api.architecture.GraphValidator;
import com.arkit.api.llm.LlmClient;

@Service
public class GenerationService {
    private final GraphValidator validator;
    private final ArchitectureParser parser;
    private final LlmClient LlmClient;
    private final String systemPrompt;

    GenerationService(GraphValidator validator, ArchitectureParser parser, LlmClient llmClient,
            @Value("classpath:prompts/hld-system-v1.txt") Resource promptFile) throws IOException {
        this.validator = validator;
        this.parser = parser;
        this.LlmClient = llmClient;
        this.systemPrompt = promptFile.getContentAsString(StandardCharsets.UTF_8);

    }

    public ArchitectureGraph GenerateArchitecture(String userPrompt) {
        String response = LlmClient.generate(systemPrompt, userPrompt);
        ArchitectureGraph parsed = parser.parse(response);
        return validator.validate(parsed);
    }

}
