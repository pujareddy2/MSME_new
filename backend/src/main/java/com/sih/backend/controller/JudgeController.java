package com.sih.backend.controller;

import com.sih.backend.dto.JudgeFinalizeRequest;
import com.sih.backend.dto.SubmissionDetailsResponse;
import com.sih.backend.service.JudgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/judge")
@CrossOrigin("*")
public class JudgeController {

    @Autowired
    private JudgeService judgeService;

    /**
     * Judge submits final decision for a submission
     * POST /api/judge/finalize
     */
    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeProblem(@RequestBody JudgeFinalizeRequest request) {
        try {
            SubmissionDetailsResponse response = judgeService.finalizeProblem(request);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Judgment submitted successfully");
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error processing judgment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/evaluations")
    public ResponseEntity<?> getJudgeEvaluations() {
        try {
            List<SubmissionDetailsResponse> submissions = judgeService.getEvaluatedSubmissionsForJudge();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", submissions.size());
            result.put("data", submissions);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getJudgeDashboard() {
        return getJudgeEvaluations();
    }

    @GetMapping("/evaluation/report/{submissionId}")
    public ResponseEntity<?> getEvaluationReport(@PathVariable Long submissionId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", judgeService.getEvaluationReport(submissionId));
        return ResponseEntity.ok(result);
    }

    /**
     * Get count of submissions awaiting judgment
     * GET /api/judge/dashboard/pending-count
     */
    @GetMapping("/dashboard/pending-count")
    public ResponseEntity<?> getPendingCount() {
        try {
            long count = judgeService.getPendingJudgmentCount();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", count);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
