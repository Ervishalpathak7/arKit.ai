package com.arkit.api.generation;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

import com.arkit.api.generation.types.ArchitectureGraph;

import tools.jackson.databind.ObjectMapper;

public class ArchitectureParserTest {

    private final ArchitectureParser parser = new ArchitectureParser(new ObjectMapper());

    @Test
    void parsesCleanJson() throws Exception {
        String json;
        try (InputStream in = getClass().getResourceAsStream("/samples/url-shortener.json")) {
            json = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
        ArchitectureGraph graph = parser.parse(json);

        assertThat(graph.nodes()).hasSize(16);
        assertThat(graph.edges()).hasSize(19);
    }

    @Test
    void stripsMarkdownFences() {
        String wrapped = """
                            Here is your architecture:
                ```json
                            {"nodes":[],"edges":[]}
                ```
                            """;

        ArchitectureGraph graph = parser.parse(wrapped);
        assertThat(graph.nodes()).isEmpty();
        assertThat(graph.edges()).isEmpty();
    }

}
