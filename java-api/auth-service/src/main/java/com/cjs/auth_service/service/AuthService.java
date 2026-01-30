package com.cjs.auth_service.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cjs.auth_service.dto.request.SignInRequestDto;
import com.cjs.auth_service.dto.request.SignUpRequestDto;
import com.cjs.auth_service.dto.response.UserResponseDto;
import com.cjs.auth_service.model.Role;
import com.cjs.auth_service.model.User;
import com.cjs.auth_service.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDto signIn(SignInRequestDto request) {

        User user = userRepository.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new UserResponseDto(user.getUsername(), user.getEmail(), user.getId(), user.getRole().toString());
    }

    public UserResponseDto signUp(SignUpRequestDto request) {

        User userExists = userRepository.findUserByEmail(request.getUsername())
                .orElse(null);
        if (userExists != null) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);

        return new UserResponseDto(user.getUsername(), user.getEmail(), user.getId(), user.getRole().toString());
    }

    public UserResponseDto userInfo(Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invalid user id"));
        return new UserResponseDto(user.getUsername(), user.getEmail(), user.getId(), user.getRole().toString());
    }
}
