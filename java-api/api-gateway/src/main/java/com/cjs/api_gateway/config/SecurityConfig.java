package com.cjs.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.cjs.api_gateway.security.JwtCookieSecurityContextRepository;

import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

        @Bean
        public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

                return http
                                // 🔥 HARD DISABLE BASIC AUTH
                                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)

                                // 🔥 HARD DISABLE FORM LOGIN
                                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)

                                // 🔥 HARD DISABLE LOGOUT
                                .logout(ServerHttpSecurity.LogoutSpec::disable)

                                // 🔥 DISABLE CSRF
                                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                                // 🔥 IMPORTANT: stop browser popup
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((exchange, e) -> Mono
                                                                .fromRunnable(() -> exchange.getResponse()
                                                                                .setStatusCode(HttpStatus.UNAUTHORIZED))))

                                // 🔥 Stateless JWT from cookie
                                .securityContextRepository(new JwtCookieSecurityContextRepository())

                                .authorizeExchange(ex -> ex
                                                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .pathMatchers("/api/auth/signin", "/api/auth/signup").permitAll()
                                                .pathMatchers("/api/auth/me", "/api/auth/signout")
                                                .hasAnyRole("USER", "ADMIN")
                                                .pathMatchers(HttpMethod.GET, "/api/problems/**").permitAll()
                                                .pathMatchers("/api/problems/**").hasAnyRole("ADMIN")
                                                .pathMatchers("/api/code/**").hasAnyRole("USER", "ADMIN")
                                                .pathMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                                                .pathMatchers(HttpMethod.GET, "/api/mcq").permitAll()
                                                .pathMatchers("/api/mcq").hasAnyRole("ADMIN")
                                                .pathMatchers("/api/mcq/quiz/**").hasAnyRole("USER", "ADMIN")
                                                .pathMatchers("/api/mcq/attempt").hasAnyRole("USER", "ADMIN")
                                                .pathMatchers("/api/ai/**").hasAnyRole("USER", "ADMIN")

                                                .anyExchange().authenticated())
                                .build();
        }

}
