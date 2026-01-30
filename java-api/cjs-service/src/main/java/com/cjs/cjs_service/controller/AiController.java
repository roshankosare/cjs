package com.cjs.cjs_service.controller;

import com.cjs.cjs_service.dto.request.AiRequestDto;
import com.cjs.cjs_service.dto.response.ApiResponseDto;
import com.cjs.cjs_service.model.Problem;
import com.cjs.cjs_service.service.GeminiService;
import com.cjs.cjs_service.service.ProblemService;
import com.cjs.cjs_service.service.PromptBuilder;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;
    private final ProblemService problemService;

    public AiController(GeminiService geminiService, ProblemService problemService) {
        this.geminiService = geminiService;
        this.problemService = problemService;
    }

    @PostMapping("/code-review")
    public ResponseEntity<?> codeReview(@RequestBody AiRequestDto dto) {

        Problem problem = problemService.getProblemById(dto.getProblemId());

        if (problem == null) {
            return ResponseEntity.badRequest().body(
                    new ApiResponseDto<>(

                            "invalid problem id",
                            null,
                            false));
        }

        String prompt = PromptBuilder.codeReviewPrompt(
                problem.getDescription(),
                dto.getCode(),
                dto.getLanguage());

        String feedback = geminiService.generate(prompt);

        return ResponseEntity.ok().body(
                Map.of("feedback", feedback));
    }
}
