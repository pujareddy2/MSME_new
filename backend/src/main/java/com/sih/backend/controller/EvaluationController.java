package com.sih.backend.controller;

import com.sih.backend.dto.*;
import com.sih.backend.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin("*")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @GetMapping
    public ResponseEntity<?> getAllEvaluations() {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", evaluationService.getAllEvaluations());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/run-ai")
    public ResponseEntity<?> runAiEvaluation(@RequestBody AiEvaluationRequest request) {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", evaluationService.runAiEvaluation(request));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitUnifiedEvaluation(@RequestBody EvaluationSubmitRequest request) {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Evaluation submitted successfully");
            result.put("data", evaluationService.submitUnifiedEvaluation(request));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/report/{submissionId}")
    public ResponseEntity<?> getEvaluationReport(@PathVariable Long submissionId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", evaluationService.getEvaluationDetails(submissionId));
        return ResponseEntity.ok(result);
    }

    /**
     * Submit evaluation for a submission with criteria-based scores
     * POST /api/evaluations
     */
    @PostMapping
    public ResponseEntity<?> submitEvaluation(@RequestBody EvaluationSubmissionRequest request) {
        try {
            SubmissionDetailsResponse response = evaluationService.submitEvaluation(request);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Evaluation submitted successfully");
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get detailed evaluation information for a submission
     * GET /api/evaluations/{submissionId}
     */
    @GetMapping("/{submissionId}")
    public ResponseEntity<?> getEvaluationDetails(@PathVariable Long submissionId) {
        try {
            SubmissionDetailsResponse response = evaluationService.getEvaluationDetails(submissionId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get count of submissions for a problem
     * GET /api/problems/{problemId}/solutions/count
     */
    @GetMapping("/problems/{problemId}/solutions/count")
    public ResponseEntity<?> getSubmissionCount(@PathVariable Long problemId) {
        try {
            SubmissionCountResponse response = evaluationService.getSubmissionCount(problemId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get submission details with evaluation information
     * GET /api/submissions/{submissionId}/details
     */
    @GetMapping("/submissions/{submissionId}/details")
    public ResponseEntity<?> getSubmissionDetails(@PathVariable Long submissionId) {
        try {
            SubmissionDetailsResponse response = evaluationService.getEvaluationDetails(submissionId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get evaluation summary for a problem
     * GET /api/problems/{problemId}/evaluation-summary
     */
    @GetMapping("/problems/{problemId}/evaluation-summary")
    public ResponseEntity<?> getEvaluationSummary(@PathVariable Long problemId) {
        try {
            ProblemEvaluationSummaryResponse response = evaluationService.getEvaluationSummary(problemId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all available evaluation criteria
     * GET /api/evaluation-criteria
     */
    @GetMapping("/criteria")
    public ResponseEntity<?> getAllCriteria() {
        try {
            List<EvaluationCriterionView> criteria = evaluationService.getAllEvaluationCriteria();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", criteria);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
