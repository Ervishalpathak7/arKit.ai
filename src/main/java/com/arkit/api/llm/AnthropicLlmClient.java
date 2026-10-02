package com.arkit.api.llm;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.arkit.api.generation.exceptions.LlmResponseException;
import com.arkit.api.generation.types.Message;
import com.arkit.api.generation.types.MessageRequest;
import com.arkit.api.generation.types.MessageResponse;

@Component 
public class AnthropicLlmClient implements LlmClient {

    private final RestClient restClient;
    private final String model;

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
            throw new LlmResponseException("Model returned no content", null);
        }
        return response.content().get(0).text();

    }

}
