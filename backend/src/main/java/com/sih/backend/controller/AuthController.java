package com.sih.backend.controller;

import com.sih.backend.dto.AuthResponse;
import com.sih.backend.dto.LoginRequest;
import com.sih.backend.dto.TeamLeaderRegistrationRequest;
import com.sih.backend.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/team-lead")
    public ResponseEntity<AuthResponse> registerTeamLeader(@RequestBody TeamLeaderRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerTeamLeader(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}