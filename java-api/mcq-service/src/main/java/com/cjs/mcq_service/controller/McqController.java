package com.cjs.mcq_service.controller;

import com.cjs.mcq_service.dto.request.CreateMcqDto;
import com.cjs.mcq_service.dto.request.SubmitMcqAnswerDto;
import com.cjs.mcq_service.dto.request.SaveMcqAttemptDto;
import com.cjs.mcq_service.dto.response.*;
import com.cjs.mcq_service.service.McqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mcq")
@RequiredArgsConstructor
public class McqController {

    private final McqService mcqService;

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<McqQuestionWithAnswerDto>> createQuestion(
            @Valid @RequestBody CreateMcqDto dto,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            McqQuestionWithAnswerDto question = mcqService.createQuestion(dto, userId);
            return ResponseEntity.ok(new ApiResponseDto<>("MCQ question created successfully", question, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<McqQuestionWithAnswerDto>>> getAllQuestions(
            @RequestParam(required = false) String category) {
        try {
            List<McqQuestionWithAnswerDto> questions = mcqService.getAllQuestions(category);
            return ResponseEntity.ok(new ApiResponseDto<>("Questions retrieved successfully", questions, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponseDto<List<String>>> getCategories() {
        try {
            List<String> categories = mcqService.getCategories();
            return ResponseEntity.ok(new ApiResponseDto<>("Categories retrieved successfully", categories, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<McqQuestionWithAnswerDto>> getQuestion(@PathVariable Long id) {
        try {
            McqQuestionWithAnswerDto question = mcqService.getQuestionById(id);
            return ResponseEntity.ok(new ApiResponseDto<>("Question retrieved successfully", question, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<McqQuestionWithAnswerDto>> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody CreateMcqDto dto) {
        try {
            McqQuestionWithAnswerDto question = mcqService.updateQuestion(id, dto);
            return ResponseEntity.ok(new ApiResponseDto<>("Question updated successfully", question, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto<Boolean>> deleteQuestion(@PathVariable Long id) {
        try {
            boolean result = mcqService.deleteQuestion(id);
            String message = result ? "Question deleted successfully" : "Question not found";
            return ResponseEntity.ok(new ApiResponseDto<>(message, result, result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @PostMapping("/quiz/start")
    public ResponseEntity<ApiResponseDto<QuizSessionDto>> startQuiz(
            @RequestParam(defaultValue = "10") Integer questionCount,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            QuizSessionDto session = mcqService.startQuiz(questionCount, category, difficulty, userId);
            return ResponseEntity.ok(new ApiResponseDto<>("Quiz started successfully", session, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @GetMapping("/quiz/{sessionId}/questions")
    public ResponseEntity<ApiResponseDto<List<McqQuestionDto>>> getQuizQuestions(@PathVariable Long sessionId) {
        try {
            List<McqQuestionDto> questions = mcqService.getQuizQuestions(sessionId);
            return ResponseEntity.ok(new ApiResponseDto<>("Quiz questions retrieved successfully", questions, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<ApiResponseDto<McqAttemptResultDto>> submitAnswer(
            @Valid @RequestBody SubmitMcqAnswerDto dto,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            McqAttemptResultDto result = mcqService.submitAnswer(dto, userId);
            return ResponseEntity.ok(new ApiResponseDto<>("Answer submitted successfully", result, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @GetMapping("/quiz/{sessionId}/result")
    public ResponseEntity<ApiResponseDto<QuizResultDto>> getQuizResult(
            @PathVariable Long sessionId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            QuizResultDto result = mcqService.getQuizResult(sessionId, userId);
            return ResponseEntity.ok(new ApiResponseDto<>("Quiz result retrieved successfully", result, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @GetMapping("/quiz/history")
    public ResponseEntity<ApiResponseDto<List<QuizSessionDto>>> getQuizHistory(
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<QuizSessionDto> history = mcqService.getUserQuizHistory(userId);
            return ResponseEntity.ok(new ApiResponseDto<>("Quiz history retrieved successfully", history, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @PostMapping("/attempt")
    public ResponseEntity<ApiResponseDto<Boolean>> saveAttempt(
            @Valid @RequestBody SaveMcqAttemptDto dto,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            mcqService.saveAttempt(dto, userId);
            return ResponseEntity.ok(new ApiResponseDto<>("Attempt saved successfully", true, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }
}