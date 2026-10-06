package com.arkit.api.architecture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import tools.jackson.databind.ObjectMapper;

@Component
public class ArchitectureParser {

    private static final Logger log = LoggerFactory.getLogger(ArchitectureParser.class);
    private final ObjectMapper objectMapper;

    ArchitectureParser(ObjectMapper om) {
        this.objectMapper = om;
    }

    public ArchitectureGraph parse(String rawLlmOutput) {
        String json = extractJson(rawLlmOutput);
        try {
            return objectMapper.readValue(json, ArchitectureGraph.class);
        } catch (RuntimeException ex) {
            log.error("Failed to parse LLM output of length {}", rawLlmOutput.length(), ex);
            throw new LlmResponseException("Model returned unparsable output");
        }
    }

    private String extractJson(String raw) {
        int start = raw.indexOf("{");
        int end = raw.lastIndexOf("}");
        if (start == -1 || end == -1 || end <= start) {
            throw new LlmResponseException("No JSON object found in model output");
        }

        return raw.substring(start, end + 1);
    }

}
