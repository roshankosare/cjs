package com.cjs.cjs_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cjs.cjs_service.dto.response.ApiResponseDto;
import com.cjs.cjs_service.repository.ProblemRepository;
import com.cjs.cjs_service.repository.SubmissionRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminController {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    public AdminController(ProblemRepository problemRepository, SubmissionRepository submissionRepository) {
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponseDto<Map<String, Long>>> getStatsOverview() {
        long problemCount = problemRepository.count();
        long submissionCount = submissionRepository.count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalProblems", problemCount);
        stats.put("totalSubmissions", submissionCount);

        return ResponseEntity.ok(
            new ApiResponseDto<>("Stats overview retrieved", stats, true)
        );
    }
}
