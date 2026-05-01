package com.sih.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.backend.dto.JudgeFinalizeRequest;
import com.sih.backend.dto.JudgeJustifyRequest;
import com.sih.backend.dto.SubmissionDetailsResponse;
import com.sih.backend.model.Application;
import com.sih.backend.model.Evaluation;
import com.sih.backend.model.Judge;
import com.sih.backend.model.JudgeReport;
import com.sih.backend.model.User;
import com.sih.backend.repository.ApplicationRepository;
import com.sih.backend.repository.EvaluationRepository;
import com.sih.backend.repository.JudgeRepository;
import com.sih.backend.repository.JudgeReportRepository;
import com.sih.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class JudgeService {

    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private EvaluationRepository evaluationRepository;
    @Autowired
    private JudgeRepository judgeRepository;
    @Autowired
    private JudgeReportRepository judgeReportRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private EvaluationService evaluationService;
    @Autowired
    private ObjectMapper objectMapper;

    public SubmissionDetailsResponse finalizeProblem(JudgeFinalizeRequest request) {
        Application application = applicationRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new RuntimeException("Application/Submission not found with ID: " + request.getSubmissionId()));
        if (!"EVALUATED".equalsIgnoreCase(application.getSubmissionStatus()) && !"JUSTIFIED".equalsIgnoreCase(application.getSubmissionStatus())) {
            throw new RuntimeException("Cannot judge. Application must be EVALUATED or JUSTIFIED first. Current status: " + application.getSubmissionStatus());
        }

        User judgeUser = userRepository.findById(request.getJudgeUserId())
                .orElseThrow(() -> new RuntimeException("Judge user not found with ID: " + request.getJudgeUserId()));
        Evaluation evaluation = evaluationRepository.findByApplication_Id(request.getSubmissionId())
                .orElseThrow(() -> new RuntimeException("No evaluation found for submission."));

        Judge judge = new Judge();
        judge.setUser(judgeUser);
        judge.setApplication(application);
        judge.setFinalScore(request.getFinalScore());
        judge.setFinalDecision(request.getFinalDecision());
        judge.setRemarks(request.getRemarks());
        judge.setJudgedAt(new Timestamp(System.currentTimeMillis()));
        judgeRepository.save(judge);

        application.setJudgedBy(judgeUser.getFullName());
        application.setJudgeScore(request.getFinalScore().intValue());
        application.setManualRemarks(request.getRemarks());
        application.setSubmissionStatus("JUSTIFIED");
        application.setEvaluatedAt(new Timestamp(System.currentTimeMillis()));
        applicationRepository.save(application);

        evaluation.setEvaluationStatus("JUSTIFIED");
        evaluationRepository.save(evaluation);

        try {
            User teamLeader = application.getTeam().getLeader();
            if (teamLeader != null && teamLeader.getUserId() != null) {
                notificationService.createNotification(
                        teamLeader.getUserId(),
                        "Application " + request.getFinalDecision() + " for '" + application.getProblem().getProblemTitle() + "'.",
                        "APPROVED".equalsIgnoreCase(request.getFinalDecision()) ? "APPLICATION_APPROVED" : "APPLICATION_REJECTED");
            }
        } catch (Exception ignored) {
        }

        return evaluationService.getEvaluationDetails(application.getId());
    }

    public SubmissionDetailsResponse justifyProblem(JudgeJustifyRequest request) {
        Application application = applicationRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new RuntimeException("Application/Submission not found with ID: " + request.getSubmissionId()));
        if (!"EVALUATED".equalsIgnoreCase(application.getSubmissionStatus()) && !"JUSTIFIED".equalsIgnoreCase(application.getSubmissionStatus())) {
            throw new RuntimeException("Cannot justify. Application must be EVALUATED first. Current status: " + application.getSubmissionStatus());
        }
        User judgeUser = userRepository.findById(request.getJudgeUserId())
                .orElseThrow(() -> new RuntimeException("Judge user not found with ID: " + request.getJudgeUserId()));
        Evaluation evaluation = evaluationRepository.findByApplication_Id(request.getSubmissionId())
                .orElseThrow(() -> new RuntimeException("No evaluation found for submission."));

        Map<String, Double> judgeScores = request.getJudgeScores() == null ? new LinkedHashMap<>() : request.getJudgeScores();
        if (judgeScores.isEmpty()) {
            throw new RuntimeException("Judge scores are required.");
        }
        double sum = 0.0;
        for (Map.Entry<String, Double> entry : judgeScores.entrySet()) {
            double value = entry.getValue() == null ? -1 : entry.getValue();
            if (value < 0 || value > 10) {
                throw new RuntimeException("Judge score for " + entry.getKey() + " must be between 0 and 10.");
            }
            sum += value;
        }
        double finalScore = round2((sum / (judgeScores.size() * 10.0)) * 100.0);
        Timestamp now = new Timestamp(System.currentTimeMillis());

        application.setJudgedBy(judgeUser.getFullName());
        application.setJudgeScore((int) Math.round(finalScore));
        application.setManualRemarks(request.getJudgeRemark() == null ? null : request.getJudgeRemark().trim());
        application.setSubmissionStatus("JUSTIFIED");
        application.setEvaluatedAt(now);
        applicationRepository.save(application);

        evaluation.setEvaluationStatus("JUSTIFIED");
        evaluationRepository.save(evaluation);

        JudgeReport report = judgeReportRepository.findBySubmission_Id(application.getId()).orElseGet(JudgeReport::new);
        report.setSubmission(application);
        report.setProblem(application.getProblem());
        report.setTeam(application.getTeam());
        report.setEvaluation(evaluation);
        report.setAiScores(evaluation.getAiScoresJson());
        report.setHumanScores(evaluation.getHumanScoresJson());
        report.setJudgeScores(writeJson(judgeScores));
        report.setAiRemark(evaluation.getAiRemark());
        report.setHumanRemark(evaluation.getHumanRemark());
        report.setJudgeRemark(request.getJudgeRemark() == null ? null : request.getJudgeRemark().trim());
        report.setFinalScore(finalScore);
        report.setSubmissionDate(application.getSubmissionDate());
        report.setEvaluationDate(application.getEvaluatedAt());
        report.setJustificationDate(now);
        judgeReportRepository.save(report);

        SubmissionDetailsResponse response = evaluationService.getEvaluationDetails(application.getId());
        response.setJudgeReportId(report.getId());
        response.setJudgeScores(judgeScores);
        response.setJudgeRemarks(report.getJudgeRemark());
        response.setJudgeScore(report.getFinalScore());
        response.setTotalScore(report.getFinalScore());
        response.setNormalizedScore(report.getFinalScore());
        response.setApplicationStatus("JUSTIFIED");
        response.setEvaluationStatus("JUSTIFIED");
        response.setJustificationDate(report.getJustificationDate());
        return response;
    }

    public List<SubmissionDetailsResponse> getEvaluatedSubmissionsForJudge() {
        return evaluationRepository.findAll().stream()
                .map(Evaluation::getApplication)
                .filter(app -> app != null && ("EVALUATED".equalsIgnoreCase(app.getSubmissionStatus()) || "JUSTIFIED".equalsIgnoreCase(app.getSubmissionStatus()) || "JUDGED".equalsIgnoreCase(app.getSubmissionStatus())))
                .map(app -> enrichWithJudgeReport(evaluationService.getEvaluationDetails(app.getId())))
                .sorted(Comparator.comparing(SubmissionDetailsResponse::getTotalScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public SubmissionDetailsResponse getEvaluationReport(Long submissionId) {
        return enrichWithJudgeReport(evaluationService.getEvaluationDetails(submissionId));
    }

    public List<SubmissionDetailsResponse> getJudgeReports() {
        return judgeReportRepository.findAllByOrderByJustificationDateDesc().stream()
                .map(report -> getJudgeReportById(report.getId()))
                .collect(Collectors.toList());
    }

    public SubmissionDetailsResponse getJudgeReportById(Long id) {
        JudgeReport report = judgeReportRepository.findBySubmission_Id(id)
                .orElseGet(() -> judgeReportRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Judge report not found with ID: " + id)));
        SubmissionDetailsResponse response = evaluationService.getEvaluationDetails(report.getSubmission().getId());
        response.setJudgeReportId(report.getId());
        response.setJudgeScores(readScoreMap(report.getJudgeScores()));
        response.setJudgeRemarks(report.getJudgeRemark());
        response.setJudgeScore(report.getFinalScore());
        response.setTotalScore(report.getFinalScore());
        response.setNormalizedScore(report.getFinalScore());
        response.setApplicationStatus("JUSTIFIED");
        response.setEvaluationStatus("JUSTIFIED");
        response.setFinalDecision("FINALIZED");
        response.setJustificationDate(report.getJustificationDate());
        response.setEvaluationDate(report.getEvaluationDate());
        return response;
    }

    public long getPendingJudgmentCount() {
        return applicationRepository.findAll().stream()
                .filter(app -> "EVALUATED".equalsIgnoreCase(app.getSubmissionStatus()))
                .count();
    }

    private SubmissionDetailsResponse enrichWithJudgeReport(SubmissionDetailsResponse response) {
        if (response == null || response.getSubmissionId() == null) return response;
        Optional<JudgeReport> reportOpt = judgeReportRepository.findBySubmission_Id(response.getSubmissionId());
        if (reportOpt.isEmpty()) return response;
        JudgeReport report = reportOpt.get();
        response.setJudgeReportId(report.getId());
        response.setJudgeScores(readScoreMap(report.getJudgeScores()));
        response.setJudgeRemarks(report.getJudgeRemark());
        response.setJudgeScore(report.getFinalScore());
        response.setTotalScore(report.getFinalScore());
        response.setNormalizedScore(report.getFinalScore());
        response.setApplicationStatus("JUSTIFIED");
        response.setEvaluationStatus("JUSTIFIED");
        response.setFinalDecision("FINALIZED");
        response.setJustificationDate(report.getJustificationDate());
        response.setEvaluationDate(report.getEvaluationDate());
        return response;
    }

    private String writeJson(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize judge report data");
        }
    }

    private Map<String, Double> readScoreMap(String json) {
        if (json == null || json.isBlank()) return new LinkedHashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Double>>() {});
        } catch (Exception ignored) {
            return new LinkedHashMap<>();
        }
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
