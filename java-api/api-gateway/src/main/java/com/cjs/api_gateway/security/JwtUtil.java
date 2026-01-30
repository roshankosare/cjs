package com.cjs.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

public class JwtUtil {

    // ⚠️ MUST be exactly the same as AuthController
    private static final String SECRET =
            "this_is_a_very_secure_secret_key_which_is_32_bytes_long";

    private static final SecretKey KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public static Claims validateAndGetClaims(String token) {

        return Jwts.parserBuilder()        // ✅ not deprecated
                .setSigningKey(KEY)       // ✅ SecretKey
                .build()
                .parseClaimsJws(token)    // throws exception if invalid
                .getBody();
    }

    public static String getRole(Claims claims) {
        // matches: .claim("role", user.getRole())
        return claims.get("role", String.class);
    }

    public static Integer getUserId(Claims claims) {
        return Integer.parseInt(claims.getSubject());
    }
}
