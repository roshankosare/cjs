package com.cjs.auth_service.controller;

import com.cjs.auth_service.dto.request.SignInRequestDto;
import com.cjs.auth_service.dto.request.SignUpRequestDto;
import com.cjs.auth_service.dto.response.ApiResponseDto;
import com.cjs.auth_service.dto.response.UserResponseDto;
import com.cjs.auth_service.service.AuthService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthService authService;

        private static final String SECRET = "this_is_a_very_secure_secret_key_which_is_32_bytes_long";

        private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

        public AuthController(AuthService authService) {
                this.authService = authService;
        }

        // ===============================
        // SIGN IN
        // ===============================
        @PostMapping("/signin")
        public ResponseEntity<ApiResponseDto<?>> signIn(
                        @RequestBody SignInRequestDto request,
                        HttpServletResponse response) {

                UserResponseDto user = authService.signIn(request);

                String token = Jwts.builder()
                                .setSubject(String.valueOf(user.getId()))
                                .claim("role", user.getRole())
                                .setIssuedAt(new Date())
                                .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
                                .signWith(KEY)
                                .compact();

                response.addHeader(
                                "Set-Cookie",
                                "jwt=" + token +
                                                "; HttpOnly" +
                                                "; Path=/" +
                                                "; Max-Age=3600" +
                                                "; SameSite=Lax");

                return ResponseEntity.ok(
                                new ApiResponseDto<>("Sign-in successful", null, true));
        }

        // ===============================
        // SIGN UP
        // ===============================
        @PostMapping("/signup")
        public ResponseEntity<ApiResponseDto<?>> signUp(
                        @RequestBody SignUpRequestDto request,
                        HttpServletResponse response) {

                UserResponseDto user = authService.signUp(request);

                String token = Jwts.builder()
                                .setSubject(String.valueOf(user.getId()))
                                .claim("role", user.getRole())
                                .setIssuedAt(new Date())
                                .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
                                .signWith(KEY)
                                .compact();

                response.addHeader(
                                "Set-Cookie",
                                "jwt=" + token +
                                                "; HttpOnly" +
                                                "; Path=/" +
                                                "; Max-Age=3600" +
                                                "; SameSite=Lax");

                return ResponseEntity.ok(
                                new ApiResponseDto<>("Sign-up successful", null, true));
        }

        // ===============================
        // SIGN OUT
        // ===============================
        @PostMapping("/signout")
        public ResponseEntity<ApiResponseDto<?>> signOut(HttpServletResponse response) {

                response.addHeader(
                                "Set-Cookie",
                                "jwt=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure");

                return ResponseEntity.ok(
                                new ApiResponseDto<>("Sign-out successful", null, true));
        }

        // ===============================
        // ME (🔥 FIXED)
        // ===============================
        @PostMapping("/me")
        public ResponseEntity<ApiResponseDto<?>> me(HttpServletRequest request) {

                int userId = getAuthenticatedUserId(request);

                UserResponseDto user = authService.userInfo(userId);

                return ResponseEntity.ok(
                                new ApiResponseDto<>(
                                                "User information retrieved successfully",
                                                user,
                                                true));
        }

        // ===============================
        // HELPER
        // ===============================
        private int getAuthenticatedUserId(HttpServletRequest request) {

                String userIdHeader = request.getHeader("X-User-Id");
                System.out.println("X-User-Id header: " + userIdHeader);

                if (userIdHeader == null)
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");

                try {
                        return Integer.parseInt(userIdHeader);
                } catch (NumberFormatException e) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Invalid user id in token");
                }
        }
}
