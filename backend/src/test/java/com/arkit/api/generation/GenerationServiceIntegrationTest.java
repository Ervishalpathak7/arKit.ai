package com.arkit.api.generation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.arkit.api.llm.LlmClient;

@SpringBootTest
@Testcontainers
class GenerationServiceIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18");

    @MockitoBean
    private LlmClient llmClient;

    @Autowired
    private GenerationService service;

    @Autowired
    private GenerationRepository repository;

    private String sampleGraphJson;

    @BeforeEach
    void setUp() throws Exception {
        repository.deleteAll();
        sampleGraphJson = Files.readString(
                Path.of("src/test/resources/samples/url-shortener.json"));
        when(llmClient.generate(any(), any())).thenReturn(sampleGraphJson);
    }

    @Test
    void secondCallWithSameDescriptionSkipsLlm() {
        String description = "a simple url shortener with caching";

        Generation first = service.generateArchitecture(description);
        Generation second = service.generateArchitecture(description);

        verify(llmClient, times(1)).generate(any(), any());
        assertThat(second.getId()).isEqualTo(first.getId());
        assertThat(repository.count()).isEqualTo(1);
    }

    @Test
    void differentDescriptionsProduceSeparateRows() {
        service.generateArchitecture("a simple url shortener with caching");
        service.generateArchitecture("a notification service with push delivery");

        verify(llmClient, times(2)).generate(any(), any());
        assertThat(repository.count()).isEqualTo(2);
    }
}