package com.arkit.api.generation.types;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MessageRequest(
        String model,
        @JsonProperty("max_tokens") int maxTokens,
        String system,
        List<Message> messages

) {

}
