package com.cjs.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.cjs.auth_service.dto.response.ApiResponseDto;
import com.cjs.auth_service.dto.response.ProblemSubmissionDetails;
import com.cjs.auth_service.dto.response.UserProfileDto;

import com.cjs.auth_service.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService) {
        this.userService = userService;

    }

    // ===============================
    // GET USER PROFILE
    // ===============================
    @GetMapping("/profile")
    public ResponseEntity<ApiResponseDto<UserProfileDto>> getUserProfile(HttpServletRequest request) {

        try {
            // int userId = getAuthenticatedUserId(request);
            // System.out.println("Fetching profile for user ID: " + userId);

            UserProfileDto profile = userService.getUserProfile(1);

            return ResponseEntity.ok(
                    new ApiResponseDto<UserProfileDto>(
                            "User profile retrieved successfully",
                            profile, true));

        } catch (Exception e) {
            System.out.println("Error fetching user profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                    new ApiResponseDto<UserProfileDto>(
                            e.getMessage(),
                            null,
                            false));
        }
    }

    // ===============================
    // GET PROBLEM SUBMISSIONS
    // ===============================
    @GetMapping("/submissions/{problemId}")
    public ResponseEntity<ApiResponseDto<List<ProblemSubmissionDetails>>> getProblemSubmissions(
            @PathVariable int problemId) {

        try {
            // int userId = getAuthenticatedUserI);

            List<ProblemSubmissionDetails> submissions = userService.getProblemSubmissions(1,problemId);
            

            return ResponseEntity.ok(
                    new ApiResponseDto<>(
                            "Problem submissions retrieved successfully",
                            submissions,
                            true));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponseDto<>(
                            e.getMessage(),
                            null,
                            false));
        }
    }

    // ===============================
    // HELPER: USER ID FROM JWT
    // ===============================
    // private int getAuthenticatedUserId(HttpServletRequest request) {

    //     String userIdHeader = request.getHeader("X-User-Id");
    //     System.out.println("X-User-Id header: " + userIdHeader);

    //     if (userIdHeader == null)
    //         throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");

    //     try {
    //         return Integer.parseInt(userIdHeader);
    //     } catch (NumberFormatException e) {
    //         throw new ResponseStatusException(
    //                 HttpStatus.BAD_REQUEST,
    //                 "Invalid user id in token");
    //     }
    // }
}
