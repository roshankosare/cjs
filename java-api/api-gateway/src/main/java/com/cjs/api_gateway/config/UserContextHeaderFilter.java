package com.cjs.api_gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class UserContextHeaderFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
            GatewayFilterChain chain) {

        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .filter(Authentication::isAuthenticated)
                .flatMap(auth -> {

                    String userId = auth.getPrincipal().toString();
                    String role = auth.getAuthorities().stream()
                            .findFirst()
                            .map(a -> a.getAuthority().replace("ROLE_", ""))
                            .orElse("USER");

                    ServerWebExchange mutated = exchange.mutate()
                            .request(builder -> builder
                                    .header("X-User-Id", userId)
                                    .header("X-User-Role", role))
                            .build();

                    return chain.filter(mutated);
                })
                .switchIfEmpty(chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        return -1; // after security
    }
}
