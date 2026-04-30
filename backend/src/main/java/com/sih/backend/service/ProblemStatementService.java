package com.sih.backend.service;

import com.sih.backend.dto.ProblemStatementRequest;
import com.sih.backend.model.ProblemStatement;
import com.sih.backend.model.User;
import com.sih.backend.repository.ProblemStatementRepository;
import com.sih.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ProblemStatementService {

    private final ProblemStatementRepository problemStatementRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ProblemStatementService(
            ProblemStatementRepository problemStatementRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.problemStatementRepository = problemStatementRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<ProblemStatement> getAllProblems() {
        return problemStatementRepository.findAll();
    }

    public ProblemStatement getProblemById(Long id) {
        return problemStatementRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem statement not found"));
    }

    @Transactional
    public ProblemStatement createProblem(ProblemStatementRequest request) {
        if (request.getProblemId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Problem ID is required");
        }

        if (request.getProblemTitle() == null || request.getProblemTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Problem title is required");
        }

        if (problemStatementRepository.existsById(request.getProblemId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Problem ID already exists");
        }

        ProblemStatement problemStatement = new ProblemStatement();
        problemStatement.setProblemId(request.getProblemId());
        problemStatement.setProblemTitle(request.getProblemTitle());
        problemStatement.setProblemDescription(request.getProblemDescription());
        problemStatement.setDomain(request.getDomain());
        problemStatement.setTheme(request.getTheme());
        problemStatement.setStatus(request.getStatus() == null || request.getStatus().isBlank()
                ? "ACTIVE"
                : request.getStatus().trim().toUpperCase());
        problemStatement.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        ProblemStatement saved = problemStatementRepository.save(problemStatement);
        notifyTeamLeadsAboutNewProblem(saved);
        return saved;
    }

    private void notifyTeamLeadsAboutNewProblem(ProblemStatement problemStatement) {
        List<User> teamLeads = userRepository.findByRoleNameIgnoreCase("TEAM_LEAD");
        String title = problemStatement.getProblemTitle() == null || problemStatement.getProblemTitle().isBlank()
                ? "Problem #" + problemStatement.getProblemId()
                : problemStatement.getProblemTitle();
        for (User user : teamLeads) {
            notificationService.createNotification(
                    user.getUserId(),
                    "New problem statement added: " + title,
                    "PROBLEM_ADDED");
        }
    }
}
