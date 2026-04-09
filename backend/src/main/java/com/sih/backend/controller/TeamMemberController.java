package com.sih.backend.controller;

import com.sih.backend.dto.AuthResponse;
import com.sih.backend.dto.LoginRequest;
import com.sih.backend.model.Application;
import com.sih.backend.model.Team;
import com.sih.backend.service.AuthService;
import com.sih.backend.service.TeamService;
import com.sih.backend.repository.ApplicationRepository;
import com.sih.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/team-member")
@CrossOrigin(origins = "*")
public class TeamMemberController {

    private final AuthService authService;
    private final TeamService teamService;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public TeamMemberController(
            AuthService authService,
            TeamService teamService,
            ApplicationRepository applicationRepository,
            UserRepository userRepository) {
        this.authService = authService;
        this.teamService = teamService;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        if (request.getRole() == null || !"TEAM_MEMBER".equalsIgnoreCase(request.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access. Only team members can login.");
        }
        return authService.login(request);
    }

    @GetMapping("/team/{userId}")
    public Team getTeam(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getTeam())
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
    }

    @GetMapping("/applications")
    public List<Application> getApplications(@RequestParam Long teamId) {
        return applicationRepository.findByTeam_TeamId(teamId);
    }
}