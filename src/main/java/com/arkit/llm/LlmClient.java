package com.arkit.llm;

public interface LlmClient {
    String generate(String systemPrompt, String userPrompt);
}
