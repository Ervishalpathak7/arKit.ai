package com.arkit.api.llm;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.arkit.api.architecture.LlmResponseException;
import com.fasterxml.jackson.annotation.JsonProperty;

@Component
class AnthropicLlmClient implements LlmClient {

    private final RestClient restClient;
    private final String model;

    record Message(String role, String content) {
    }

    record ContentBlock(String type, String text) {
    }

    record MessageResponse(List<ContentBlock> content) {
    }

    record MessageRequest(
            String model,
            @JsonProperty("max_tokens") int maxTokens,
            String system,
            List<Message> messages

    ) {
    }

    AnthropicLlmClient(RestClient rc, @Value("${llm.model}") String model) {
        this.restClient = rc;
        this.model = model;
    }

    @Override
    public String generate(String systemPrompt, String userPrompt) {
        MessageRequest request = new MessageRequest(model, 4096, systemPrompt,
                List.of(new Message("user", userPrompt)));
        MessageResponse response = restClient.post()
                .uri("/v1/messages")
                .body(request)
                .retrieve()
                .body(MessageResponse.class);

        if (response == null || response.content() == null || response.content().isEmpty()) {
            throw new LlmResponseException("Model returned no content");
        }
        return response.content().get(0).text();

    }

}
