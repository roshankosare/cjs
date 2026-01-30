package com.cjs.cjs_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @PostConstruct
    void verify() {
        System.out.println("Gemini model = " + model);
        System.out.println("Gemini API key loaded = " + (apiKey != null));
    }

    public String generate(String prompt) {

        String url = "https://generativelanguage.googleapis.com/v1beta/"
                + model + ":generateContent?key=" + apiKey;

        var body = new Object() {
            public final Object[] contents = new Object[]{
                new Object() {
                    public final Object[] parts = new Object[]{
                        new Object() {
                            public final String text = prompt;
                        }
                    };
                }
            };
        };

        JsonNode response = webClient.post()
                .uri(url)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        return response
                .get("candidates").get(0)
                .get("content")
                .get("parts").get(0)
                .get("text")
                .asText();
    }
}
