package com.example.springboot;

import com.example.springboot.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtRequestFilter jwtRequestFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/login").permitAll() // разрешаем доступ к логину
                        .requestMatchers("/").permitAll() // разрешаем доступ к корневому URL
                        .requestMatchers("/home").permitAll()
                        .requestMatchers("/statistics").permitAll()
                        .requestMatchers("/profile").permitAll()
                        .requestMatchers("/products").permitAll()
                        .requestMatchers("/clients").permitAll()
                        .requestMatchers("/employees").permitAll()
                        .requestMatchers("/suppliers").permitAll()
                        .requestMatchers("/map").permitAll()
                        .requestMatchers("/index.html").permitAll()
                        .requestMatchers("/static/**").permitAll() // разрешаем доступ к статическим ресурсам
                        .requestMatchers("/css/**").permitAll() // разрешаем доступ к CSS
                        .requestMatchers("/js/**").permitAll()
                        .requestMatchers("/icon/**").permitAll()
                        .requestMatchers("/reading.png").permitAll()// разрешаем доступ к JS
                        .anyRequest().authenticated() // остальные запросы требуют аутентификации
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // без состояния
                )
                .csrf(AbstractHttpConfigurer::disable) // Отключаем CSRF, если используем JWT
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
                        })
                );
// Добавляем фильтр для обработки JWT
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailsService);
        return authenticationManagerBuilder.build();
    }
}