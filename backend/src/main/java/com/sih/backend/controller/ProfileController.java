package com.sih.backend.controller;

import com.sih.backend.dto.AuthResponse;
import com.sih.backend.repository.UserRepository;
import com.sih.backend.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public ProfileController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AuthResponse> getProfile(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(authService.toResponse(user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}