package com.sih.backend.controller;

import com.sih.backend.dto.ProblemStatementRequest;
import com.sih.backend.model.ProblemStatement;
import com.sih.backend.service.ProblemStatementService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "*")
public class ProblemStatementController {

    private final ProblemStatementService problemStatementService;

    public ProblemStatementController(ProblemStatementService problemStatementService) {
        this.problemStatementService = problemStatementService;
    }

    @GetMapping
    public List<ProblemStatement> getAllProblems() {
        return problemStatementService.getAllProblems();
    }

    @GetMapping("/{id}")
    public ProblemStatement getProblemById(@PathVariable Long id) {
        return problemStatementService.getProblemById(id);
    }

    @PostMapping
    public ResponseEntity<ProblemStatement> createProblem(@RequestBody ProblemStatementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(problemStatementService.createProblem(request));
    }
}