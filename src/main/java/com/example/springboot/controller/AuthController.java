package com.example.springboot.controller;

import com.example.springboot.AuthResponse;
import com.example.springboot.DTO.LoginRequest;
import com.example.springboot.JwtUtil;
import com.example.springboot.model.Employees;
import com.example.springboot.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Optional<Employees> employee = authenticationService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        String accessrights = authenticationService.getUserAccessrights(loginRequest.getUsername());

        String name = authenticationService.getName(loginRequest.getUsername());

        if (employee.isPresent()) {
            String token = jwtUtil.generateToken(employee.get().getUsername());
            return ResponseEntity.ok(new AuthResponse(token, accessrights, name)); // Верните токен в ответе
        }
        return ResponseEntity.status(401).body("Неверный логин или пароль");
    }
}
