package com.cjs.api_gateway.security;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

public class JwtCookieSecurityContextRepository
        implements ServerSecurityContextRepository {

    private static final String COOKIE_NAME = "jwt";

    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        return Mono.empty();
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {

        HttpCookie cookie = exchange.getRequest()
                .getCookies()
                .getFirst(COOKIE_NAME);

        if (cookie == null)
            return Mono.empty();

        try {
            Claims claims = JwtUtil.validateAndGetClaims(cookie.getValue());

            String userId = JwtUtil.getUserId(claims).toString();
            String role = JwtUtil.getRole(claims);

            var authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role));

            var authentication = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    authorities);

            return Mono.just(new SecurityContextImpl(authentication));

        } catch (Exception e) {
            return Mono.empty();
        }
    }
}