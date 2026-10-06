package com.arkit.api.llm;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
class LlmConfig {

    @Bean
    RestClient anthropicRestClient(@Value("${llm.api-key}") String apikey) {
        var factory = new JdkClientHttpRequestFactory();
        factory.setReadTimeout(Duration.ofSeconds(60));

        return RestClient.builder()
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", apikey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .requestFactory(factory)
                .build();
    }

}
