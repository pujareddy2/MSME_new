package com.sih.backend.controller;

import com.sih.backend.dto.AiEvaluationRequest;
import com.sih.backend.dto.EvaluationSubmitRequest;
import com.sih.backend.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluation")
@CrossOrigin("*")
public class EvaluationWorkflowController {

    @Autowired
    private EvaluationService evaluationService;

    @GetMapping("/{submissionId}")
    public ResponseEntity<?> getEvaluation(@PathVariable Long submissionId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", evaluationService.getEvaluationDetails(submissionId));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/report/{submissionId}")
    public ResponseEntity<?> getReport(@PathVariable Long submissionId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", evaluationService.getEvaluationDetails(submissionId));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/run-ai")
    public ResponseEntity<?> runAi(@RequestBody AiEvaluationRequest request) {
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
    public ResponseEntity<?> submit(@RequestBody EvaluationSubmitRequest request) {
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
}
