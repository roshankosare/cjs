package com.cjs.cjs_service.service;

public class PromptBuilder {

    public static String codeReviewPrompt(
            String problem,
            String code,
            String language) {
        return """
                You are an interview coding assistant.

                Rules:
                - DO NOT provide full solutions
                - DO NOT rewrite entire code
                - Only give hints and analysis

                Problem:
                %s

                Language:
                %s

                User Code:
                %s

                Provide:
                1. Correctness feedback
                2. Time & space complexity
                3. Optimization hints
                """.formatted(problem, language, code);
    }
}
