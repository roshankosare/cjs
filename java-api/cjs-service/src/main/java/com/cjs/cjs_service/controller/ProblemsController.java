package com.cjs.cjs_service.controller;

import com.cjs.cjs_service.dto.*;
import com.cjs.cjs_service.dto.request.CreateProblemDto;
import com.cjs.cjs_service.dto.request.UpdateProblemDto;
import com.cjs.cjs_service.dto.response.ApiResponseDto;
import com.cjs.cjs_service.dto.response.GetAllProblemDto;
import com.cjs.cjs_service.dto.response.GetProblemDto;
import com.cjs.cjs_service.dto.response.ProblemMetaDataDto;
import com.cjs.cjs_service.dto.response.SampleTestCaseDto;
import com.cjs.cjs_service.dto.response.AdminGetProblemDto;
import com.cjs.cjs_service.service.ProblemService;
import com.cjs.cjs_service.service.SubmissionService;
import com.cjs.cjs_service.dto.TestCaseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/problems")
public class ProblemsController {

        private final ProblemService problemService;
        private final SubmissionService submissionService;

        public ProblemsController(ProblemService problemService,
                        SubmissionService submissionService) {
                this.problemService = problemService;
                this.submissionService = submissionService;
        }

        // ===============================
        // GET ALL PROBLEMS (PUBLIC)
        // ===============================
        @GetMapping
        public ResponseEntity<ApiResponseDto<GetAllProblemDto>> getAllProblems(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "10") int pageSize) {

                if (page <= 0)
                        page = 1;
                if (pageSize <= 0 || pageSize > 50)
                        pageSize = 10;

                Pageable pageable = PageRequest.of(page - 1, pageSize);

                var problemsPage = problemService.getProblems(
                                null, // difficulty
                                null, // tags
                                pageable);

                GetAllProblemDto responseDto = new GetAllProblemDto();
                responseDto.setProblems(
                                problemsPage.getContent().stream()
                                                .map(p -> {
                                                        ProblemMetaDataDto dto = new ProblemMetaDataDto();
                                                        dto.setTitle(p.getTitle());
                                                        dto.setSlug(p.getSlug());
                                                        dto.setDifficulty(p.getDifficulty());
                                                        return dto;
                                                })
                                                .collect(Collectors.toList()));
                responseDto.setTotal(problemsPage.getTotalElements());
                responseDto.setPage(page);
                responseDto.setPageSize(pageSize);

                return ResponseEntity.ok(
                                new ApiResponseDto<>(
                                                "Problems fetched successfully",
                                                responseDto,
                                                true));
        }

        // ===============================
        // GET PROBLEM BY SLUG (PUBLIC)
        // ===============================
        @GetMapping("/{slug}")
        public ResponseEntity<ApiResponseDto<GetProblemDto>> getProblem(
                        @PathVariable String slug) {

                var problem = problemService.getProblemBySlug(slug);

                if (problem == null) {
                        return ResponseEntity.status(404).body(
                                        new ApiResponseDto<>(
                                                        "Problem not found",
                                                        null,
                                                        false));
                }

                GetProblemDto dto = new GetProblemDto();
                dto.setId(problem.getId());
                dto.setTitle(problem.getTitle());
                dto.setDescription(problem.getDescription());
                dto.setDifficulty(problem.getDifficulty());

                List<String> tags = problem.getProblemTags()
                                .stream()
                                .map(pt -> pt.getTag().getName())
                                .collect(Collectors.toList());
                dto.setTags(tags);

                dto.setSampleTestCases(
                                problem.getTestCases()
                                                .stream()
                                                .filter(tc -> tc.isSample())
                                                .map(tc -> {
                                                        SampleTestCaseDto sc = new SampleTestCaseDto();
                                                        sc.setInput(tc.getInput());
                                                        sc.setOutput(tc.getExpectedOutput());
                                                        sc.setSample(tc.isSample()); // ✅ FIXED// ✅ FIXED
                                                        return sc;
                                                })
                                                .collect(Collectors.toList()));

                return ResponseEntity.ok(
                                new ApiResponseDto<>(
                                                "Problem fetched successfully",
                                                dto,
                                                true));
        }

        // ===============================
        // GET PROBLEM (ADMIN)
        // ===============================
        // @PreAuthorize("hasRole('ADMIN')")
        @GetMapping("/admin/{slug}")
        public ResponseEntity<ApiResponseDto<AdminGetProblemDto>> getProblemAdmin(
                        @PathVariable String slug) {

                var problem = problemService.getProblemBySlug(slug);

                if (problem == null) {
                        return ResponseEntity.status(404).body(
                                        new ApiResponseDto<>(
                                                        "Problem not found",
                                                        null,
                                                        false));
                }

                AdminGetProblemDto dto = new AdminGetProblemDto();
                dto.setId(problem.getId());
                dto.setTitle(problem.getTitle());
                dto.setDescription(problem.getDescription());
                dto.setDifficulty(problem.getDifficulty());

                List<String> tags = problem.getProblemTags()
                                .stream()
                                .map(pt -> pt.getTag().getName())
                                .collect(Collectors.toList());
                dto.setTags(tags);

                // ✅ TEST CASES
                dto.setTestCases(
                                problem.getTestCases()
                                                .stream()
                                                .map(tc -> {
                                                        TestCaseDto tcd = new TestCaseDto();
                                                        tcd.setInput(tc.getInput());
                                                        tcd.setOutput(tc.getExpectedOutput());
                                                        tcd.setSample(tc.isSample()); // ✅ FIXED
                                                        return tcd;
                                                })
                                                .collect(Collectors.toList()));

                return ResponseEntity.ok(
                                new ApiResponseDto<>(
                                                "Problem fetched successfully",
                                                dto,
                                                true));

        }

        // ===============================
        // CREATE PROBLEM (ADMIN)
        // ===============================
        // @PreAuthorize("hasRole('ADMIN')")
        @PostMapping
        public ResponseEntity<ApiResponseDto<Integer>> createProblem(
                        @Valid @RequestBody CreateProblemDto dto) {

                int problemId = problemService.createProblem(dto);

                return ResponseEntity.ok(
                                new ApiResponseDto<>(
                                                "Problem created successfully",
                                                problemId,
                                                true));
        }

        // ===============================
        // UPDATE PROBLEM (ADMIN)
        // ===============================
        // @PreAuthorize("hasRole('ADMIN')")
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponseDto<Boolean>> updateProblem(
                        @PathVariable int id,
                        @Valid @RequestBody UpdateProblemDto dto) {

                boolean updated = problemService.updateProblem(id, dto);
                System.out.println("Update problem ID " + id + ": " + updated);

                if (!updated) {
                        return ResponseEntity.status(404).body(
                                        new ApiResponseDto<>(
                                                        "Problem not found",
                                                        false,
                                                        false));
                }

                return ResponseEntity.ok(
                                new ApiResponseDto<>(
                                                "Problem updated successfully",
                                                true,
                                                true));
        }

        @GetMapping("/user-submissions")
        public ResponseEntity<ApiResponseDto<List<ProblemSubmissionDetails>>> getUserSubmissions(
                        HttpServletRequest request) {

                try {
                        // ✅ TRUST GATEWAY HEADER
                        int userId = getAuthenticatedUserId(request);

                        List<ProblemSubmissionDetails> submissions = submissionService.getUserSubmissions(userId);
                        System.out.println("Fetched " + submissions.size() + " submissions for user ID: " + userId);

                        return ResponseEntity.ok(
                                        new ApiResponseDto<>(
                                                        "User submissions retrieved successfully",
                                                        submissions,
                                                        true));

                } catch (Exception e) {
                        System.out.println("Error fetching user submissions: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                        new ApiResponseDto<>(
                                                        e.getMessage(),
                                                        null,
                                                        false));
                }
        }

        @GetMapping("/{problemId}/submissions-by-user")
        public ResponseEntity<ApiResponseDto<List<ProblemSubmissionDetails>>> getProblemSubmissionsByUser(
                        @PathVariable int problemId,
                        HttpServletRequest request) {

                try {
                        // ✅ TRUST GATEWAY HEADER
                        int userId = getAuthenticatedUserId(request);

                        List<ProblemSubmissionDetails> submissions = submissionService.getProblemSubmissions(userId,
                                        problemId);

                        return ResponseEntity.ok(
                                        new ApiResponseDto<>(
                                                        "Problem submissions retrieved successfully",
                                                        submissions,
                                                        true));

                } catch (ResponseStatusException e) {
                        throw e;
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                        new ApiResponseDto<>(
                                                        e.getMessage(),
                                                        null,
                                                        false));
                }
        }

        // ===============================
        // HEADER HELPER (FINAL)
        // ===============================
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
