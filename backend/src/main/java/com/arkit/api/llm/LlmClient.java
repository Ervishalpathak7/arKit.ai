package com.arkit.api.llm;

public interface LlmClient {
    String generate(String systemPrompt, String userPrompt);
}
