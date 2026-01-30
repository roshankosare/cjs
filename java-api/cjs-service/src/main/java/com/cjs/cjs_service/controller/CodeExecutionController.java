package com.cjs.cjs_service.controller;

import com.cjs.cjs_service.dto.request.CodeRunRequestDto;
import com.cjs.cjs_service.dto.response.ApiResponseDto;
import com.cjs.cjs_service.model.Submission;
import com.cjs.cjs_service.service.SubmissionService;
import com.cjs.cjs_service.service.codeExecutionSerivce.CodeExecutionService;

import jakarta.servlet.http.HttpServletRequest;

import com.cjs.cjs_service.dto.ExecutionJob;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/code")
public class CodeExecutionController {

        private final CodeExecutionService service;
        private final SubmissionService submissionService;

        public CodeExecutionController(
                        CodeExecutionService service,
                        SubmissionService submissionService) {
                this.service = service;
                this.submissionService = submissionService;
        }

        // ===============================
        // Run Code
        // ===============================
        // @PreAuthorize("isAuthenticated()")
        @PostMapping("/run")
        public ResponseEntity<ApiResponseDto<String>> runCode(
                        @RequestBody CodeRunRequestDto dto) {

                System.out.println("Received run code request: " + dto.getSourceCode() + dto.getLanguage() + dto.getProblemId());

                try {
                        String jobId = service.run(dto);
                        System.out.println("Created job with ID: " + jobId);

                        return ResponseEntity.ok(
                                        new ApiResponseDto<String>(
                                                        "Execution started",
                                                        jobId,
                                                        true

                                        ));
                } catch (Exception e) {
                        return ResponseEntity
                                        .badRequest()
                                        .body(new ApiResponseDto<>(
                                                        e.getMessage(),
                                                        null,
                                                        false));
                }
        }

        // ===============================
        // Submit Code
        // ===============================
        // @PreAuthorize("isAuthenticated()")
        @PostMapping("/submit")
        public ResponseEntity<ApiResponseDto<String>> submitCode(
                        @RequestBody CodeRunRequestDto dto,
                        HttpServletRequest request) {

                try {
                        int userId = getAuthenticatedUserId(request);

                        Submission submission = submissionService.createSubmission(
                                        userId,
                                        dto.getProblemId(),
                                        dto.getSourceCode(),
                                        dto.getLanguage());

                        String jobId = service.submit(dto, submission.getId());

                        return ResponseEntity.ok(
                                        new ApiResponseDto<>(
                                                        "Execution started",
                                                        jobId,
                                                        true));

                } catch (Exception e) {
                        return ResponseEntity.ok(
                                        new ApiResponseDto<>(
                                                        "Submission failed: " + e.getMessage(),
                                                        null,
                                                        false));
                }
        }

        // ===============================
        // Get Status
        // ===============================
        @GetMapping("/status/{jobId}")
        public ResponseEntity<ApiResponseDto<ExecutionJob>> getStatus(
                        @PathVariable String jobId) {

                ExecutionJob job = service.getStatus(jobId);
               

                if (job == null) {
                        return ResponseEntity.notFound().build();
                }
                 System.out.println("Fetched job status for ID: " + job.getStatus());

                return ResponseEntity.ok(
                                new ApiResponseDto<>(
                                                "Status fetched",
                                                job,
                                                true

                                ));
        }

        private int getAuthenticatedUserId(HttpServletRequest request) {

                String userIdHeader = request.getHeader("X-User-Id");
                System.out.println("X-User-Id header: " + userIdHeader);

                if (userIdHeader == null || userIdHeader.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Unauthorized");
                }

                try {
                        return Integer.parseInt(userIdHeader);
                } catch (NumberFormatException e) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Invalid user id in token");
                }
        }
}
