package com.cjs.auth_service.client;

import com.cjs.auth_service.dto.response.ApiResponseDto;
import com.cjs.auth_service.dto.response.ProblemSubmissionDetails;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "PROBLEM-SERVICE")
public interface CjsServiceClient {

    @GetMapping("/api/problems/{problemId}/submissions-by-user")
    ApiResponseDto<List<ProblemSubmissionDetails>> getProblemSubmissionsByUser(
            @RequestHeader("X-User-Id") int userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable("problemId") int problemId);

    @GetMapping("/api/problems/user-submissions")
    ApiResponseDto<List<ProblemSubmissionDetails>> getUserSubmissions(
            @RequestHeader("X-User-Id") int userId,
            @RequestHeader("X-User-Role") String role);
}
