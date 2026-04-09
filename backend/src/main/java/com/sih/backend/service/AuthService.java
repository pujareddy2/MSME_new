package com.sih.backend.service;

import com.sih.backend.dto.AuthResponse;
import com.sih.backend.dto.LoginRequest;
import com.sih.backend.dto.TeamLeaderRegistrationRequest;
import com.sih.backend.model.Team;
import com.sih.backend.model.User;
import com.sih.backend.repository.TeamRepository;
import com.sih.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, TeamRepository teamRepository) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    @Transactional
    public AuthResponse registerTeamLeader(TeamLeaderRegistrationRequest request) {
        validateRegistration(request);

        if (userRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered as a Team Leader.");
        }

        if (userRepository.existsByPhoneNumberIgnoreCase(request.getPhone().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This phone number is already registered.");
        }

        User user = new User();
        user.setFullName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhoneNumber(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRoleName("TEAM_LEAD");
        user.setCollegeId(request.getCollegeId());
        user.setAccountStatus("ACTIVE");
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()
                || request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        String role = request.getRole() == null ? "" : request.getRole().trim().toUpperCase();
        User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
            .or(() -> userRepository.findByPhoneNumberIgnoreCase(request.getEmail().trim()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found. Please register first."));

        if (user.getRoleName() != null && !user.getRoleName().equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access for selected role");
        }

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        return toResponse(user);
    }

    public AuthResponse toResponse(User user) {
        AuthResponse response = new AuthResponse();
        response.setUserId(user.getUserId());
        response.setName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhoneNumber());
        response.setRole(user.getRoleName());
        response.setCollegeId(user.getCollegeId());
        if (user.getTeam() != null) {
            response.setTeamId(user.getTeam().getTeamId());
            response.setTeamName(user.getTeam().getTeamName());
        }
        return response;
    }

    private void validateRegistration(TeamLeaderRegistrationRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password confirmation must match");
        }
    }
}