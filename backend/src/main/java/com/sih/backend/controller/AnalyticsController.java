package com.sih.backend.controller;

import com.sih.backend.model.Application;
import com.sih.backend.model.ProblemStatement;
import com.sih.backend.repository.ApplicationRepository;
import com.sih.backend.repository.ProblemStatementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Analytics Controller - Provides real-time analytics data for dashboards
 */
@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private ProblemStatementRepository problemStatementRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    /**
     * GET /api/analysis/summary
     * Returns aggregated summary metrics
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getSummaryMetrics() {
        try {
            long totalProblems = problemStatementRepository.count();
            long totalSubmissions = applicationRepository.count();

            // Count software vs hardware problems
            List<ProblemStatement> allProblems = problemStatementRepository.findAll();
            long softwareProblems = allProblems.stream()
                    .filter(p -> p.getDomain() != null && p.getDomain().toLowerCase().contains("software"))
                    .count();
            long hardwareProblems = allProblems.stream()
                    .filter(p -> p.getDomain() != null && p.getDomain().toLowerCase().contains("hardware"))
                    .count();

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("totalProblems", totalProblems);
            response.put("totalSubmissions", totalSubmissions);
            response.put("softwareProblems", softwareProblems);
            response.put("hardwareProblems", hardwareProblems);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/analysis/chart
     * Returns problem-wise submission counts for charting
     */
    @GetMapping("/chart")
    public ResponseEntity<?> getChartData() {
        try {
            List<ProblemStatement> problems = problemStatementRepository.findAll();
            List<Map<String, Object>> chartData = new ArrayList<>();

            for (ProblemStatement problem : problems) {
                long submissionCount = applicationRepository.countByProblem_ProblemId(problem.getProblemId());

                Map<String, Object> dataPoint = new LinkedHashMap<>();
                dataPoint.put("problemId", problem.getCustomProblemId() != null ? problem.getCustomProblemId() : problem.getProblemId());
                dataPoint.put("problemTitle", problem.getProblemTitle());
                dataPoint.put("submissionCount", submissionCount);

                chartData.add(dataPoint);
            }

            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/analysis/problems
     * Returns table data with problem and submission information
     */
    @GetMapping("/problems")
    public ResponseEntity<?> getProblemsAnalysis() {
        try {
            List<ProblemStatement> problems = problemStatementRepository.findAll();
            List<Map<String, Object>> analysisData = new ArrayList<>();

            for (ProblemStatement problem : problems) {
                long submissionCount = applicationRepository.countByProblem_ProblemId(problem.getProblemId());

                // Categorize by type
                String type = "General";
                if (problem.getDomain() != null) {
                    if (problem.getDomain().toLowerCase().contains("software")) {
                        type = "Software";
                    } else if (problem.getDomain().toLowerCase().contains("hardware")) {
                        type = "Hardware";
                    }
                }

                Map<String, Object> problemData = new LinkedHashMap<>();
                problemData.put("problemId", problem.getCustomProblemId() != null ? problem.getCustomProblemId() : problem.getProblemId());
                problemData.put("problemTitle", problem.getProblemTitle());
                problemData.put("type", type);
                problemData.put("submissionCount", submissionCount);

                analysisData.add(problemData);
            }

            return ResponseEntity.ok(analysisData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/analysis/problem/{id}
     * Returns detailed analysis for a specific problem including applied teams
     */
    @GetMapping("/problem/{id}")
    public ResponseEntity<?> getProblemAnalysis(@PathVariable Long id) {
        try {
            ProblemStatement problem = problemStatementRepository.findById(id).orElse(null);
            if (problem == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Problem not found"));
            }

            List<Application> applications = applicationRepository.findByProblem_ProblemId(id);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("problem", new LinkedHashMap<String, Object>() {{
                put("problemId", problem.getCustomProblemId() != null ? problem.getCustomProblemId() : problem.getProblemId());
                put("title", problem.getProblemTitle());
                put("description", problem.getProblemDescription());
                put("theme", problem.getTheme());
                put("domain", problem.getDomain());
            }});

            List<Map<String, Object>> teams = applications.stream()
                    .map(app -> {
                        Map<String, Object> teamData = new LinkedHashMap<>();
                        if (app.getTeam() != null) {
                            teamData.put("teamName", app.getTeam().getTeamName());
                            teamData.put("teamLeader", app.getTeam().getLeader() != null ? app.getTeam().getLeader().getFullName() : "N/A");
                        }
                        teamData.put("abstract", app.getAbstractText());
                        teamData.put("githubLink", app.getGithubLink());
                        teamData.put("pptLink", app.getPptFilePath());
                        teamData.put("demoLink", app.getDemoLink());
                        teamData.put("submissionDate", app.getEvaluatedAt());
                        return teamData;
                    })
                    .collect(Collectors.toList());

            response.put("appliedTeams", teams);
            response.put("totalApplications", applications.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/analysis/problem/{id}/report
     * Returns evaluation report for a specific problem submission
     */
    @GetMapping("/problem/{id}/report")
    public ResponseEntity<?> getProblemReport(@PathVariable Long id) {
        try {
            Application application = applicationRepository.findById(id).orElse(null);
            if (application == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Application not found"));
            }

            Map<String, Object> report = new LinkedHashMap<>();
            report.put("applicationId", application.getId());
            report.put("teamName", application.getTeam() != null ? application.getTeam().getTeamName() : "N/A");
            report.put("submissionStatus", application.getSubmissionStatus());
            report.put("aiScore", application.getAiScore());
            report.put("aiRemarks", application.getAiRemarks());
            report.put("manualScore", application.getManualScore());
            report.put("manualRemarks", application.getManualRemarks());
            report.put("judgeScore", application.getJudgeScore());
            report.put("submissionDate", application.getEvaluatedAt());

            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
