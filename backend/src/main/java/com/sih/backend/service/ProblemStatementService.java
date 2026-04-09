package com.sih.backend.service;

import com.sih.backend.dto.ProblemStatementRequest;
import com.sih.backend.model.ProblemStatement;
import com.sih.backend.repository.ProblemStatementRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ProblemStatementService {

    private final ProblemStatementRepository problemStatementRepository;

    public ProblemStatementService(ProblemStatementRepository problemStatementRepository) {
        this.problemStatementRepository = problemStatementRepository;
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

        if (request.getSubmissionDeadline() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission deadline is required");
        }

        if (problemStatementRepository.existsById(request.getProblemId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Problem ID already exists");
        }

        ProblemStatement problemStatement = new ProblemStatement();
        problemStatement.setProblemId(request.getProblemId());
        problemStatement.setProblemTitle(request.getProblemTitle());
        problemStatement.setProblemDescription(request.getProblemDescription());
        problemStatement.setDomain(request.getDomain());
        problemStatement.setOrganizationName(request.getOrganizationName());
        problemStatement.setDifficultyLevel(request.getDifficultyLevel());
        problemStatement.setSubmissionDeadline(request.getSubmissionDeadline());
        problemStatement.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return problemStatementRepository.save(problemStatement);
    }
}