package com.cjs.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cjs.auth_service.dto.response.ApiResponseDto;
import com.cjs.auth_service.service.UserService;
import com.cjs.auth_service.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponseDto<Long>> getTotalUsers() {
        long count = userRepository.count();
        return ResponseEntity.ok(
            new ApiResponseDto<>("Total user count retrieved", count, true)
        );
    }
}
