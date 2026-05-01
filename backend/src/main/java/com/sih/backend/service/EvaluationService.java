package com.sih.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.backend.dto.*;
import com.sih.backend.model.*;
import com.sih.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class EvaluationService {

    private static final List<String> STANDARD_CRITERIA = List.of(
            "Innovation",
            "Technical Implementation",
            "Problem Relevance",
            "Use of AI Tools",
            "Feasibility",
            "Scalability"
    );

    @Autowired
    private EvaluationRepository evaluationRepository;
    @Autowired
    private EvaluationScoreRepository evaluationScoreRepository;
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ObjectMapper objectMapper;

    public List<SubmissionDetailsResponse> getAllEvaluations() {
        return evaluationRepository.findAll().stream()
                .map(Evaluation::getApplication)
                .filter(Objects::nonNull)
                .map(app -> getEvaluationDetails(app.getId()))
                .collect(Collectors.toList());
    }

    public AiEvaluationResponse runAiEvaluation(AiEvaluationRequest request) {
        if (request == null || request.getSubmissionId() == null) {
            throw new RuntimeException("submissionId is required");
        }

        Application application = applicationRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + request.getSubmissionId()));

        Map<String, Double> aiScores = generateAiScores(application);
        double aiTotal = aiScores.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        String aiRemark = generateAiRemark(application, aiScores);

        Evaluation evaluation = evaluationRepository.findByApplication_Id(application.getId()).orElseGet(Evaluation::new);
        evaluation.setApplication(application);
        evaluation.setEvaluationStatus("AI_COMPLETED");
        evaluation.setAiScoresJson(writeJson(aiScores));
        evaluation.setAiRemark(aiRemark);
        evaluation.setCreatedAt(evaluation.getCreatedAt() == null ? new Timestamp(System.currentTimeMillis()) : evaluation.getCreatedAt());
        evaluationRepository.save(evaluation);

        application.setAiScore((int) Math.round((aiTotal / 10.0) * 100.0));
        application.setAiRemarks(aiRemark);
        applicationRepository.save(application);

        AiEvaluationResponse response = new AiEvaluationResponse();
        response.setSubmissionId(application.getId());
        response.setAiScores(aiScores);
        response.setAiTotalScore(round2(aiTotal));
        response.setAiRemark(aiRemark);
        return response;
    }

    public SubmissionDetailsResponse submitUnifiedEvaluation(EvaluationSubmitRequest request) {
        if (request == null || request.getSubmissionId() == null) {
            throw new RuntimeException("submissionId is required");
        }

        Application application = applicationRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + request.getSubmissionId()));

        Map<String, Double> aiScores = normalizeCriteriaMap(request.getAiScores());
        Map<String, Double> humanScores = normalizeCriteriaMap(request.getHumanScores());
        validateScores(aiScores, "AI");
        validateScores(humanScores, "Human");

        boolean aiProvided = hasAnyNonZeroScore(aiScores) || (request.getAiRemark() != null && !request.getAiRemark().trim().isEmpty());
        boolean humanProvided = hasAnyNonZeroScore(humanScores) || (request.getHumanRemark() != null && !request.getHumanRemark().trim().isEmpty());

        if (!aiProvided && !humanProvided) {
            throw new RuntimeException("Provide at least one evaluation input (AI or Human) before submitting.");
        }

        double aiAverage10 = aiScores.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double humanAverage10 = humanScores.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double aiPercent = (aiAverage10 / 10.0) * 100.0;
        double humanPercent = (humanAverage10 / 10.0) * 100.0;
        double finalPercent;
        if (aiProvided && humanProvided) {
            finalPercent = round2((aiPercent * 0.4) + (humanPercent * 0.6));
        } else if (humanProvided) {
            finalPercent = round2(humanPercent);
        } else {
            finalPercent = round2(aiPercent);
        }

        Evaluation evaluation = evaluationRepository.findByApplication_Id(application.getId()).orElseGet(Evaluation::new);
        evaluation.setApplication(application);
        evaluation.setEvaluationStatus("COMPLETED");
        evaluation.setAiScoresJson(writeJson(aiScores));
        evaluation.setAiRemark(request.getAiRemark());
        evaluation.setHumanScoresJson(writeJson(humanScores));
        evaluation.setHumanRemark(request.getHumanRemark() == null ? null : request.getHumanRemark().trim());
        evaluation.setTotalScore(finalPercent);
        evaluation.setComments(
                request.getHumanRemark() != null && !request.getHumanRemark().trim().isEmpty()
                        ? request.getHumanRemark().trim()
                        : (request.getAiRemark() == null ? "Evaluation submitted." : request.getAiRemark().trim())
        );
        evaluation.setCreatedAt(evaluation.getCreatedAt() == null ? new Timestamp(System.currentTimeMillis()) : evaluation.getCreatedAt());
        evaluationRepository.save(evaluation);

        upsertEvaluationScores(evaluation, humanScores);

        application.setSubmissionStatus("EVALUATED");
        application.setAiScore((int) Math.round(aiPercent));
        application.setAiRemarks(request.getAiRemark());
        application.setManualScore((int) Math.round(humanPercent));
        application.setManualRemarks(request.getHumanRemark() == null ? null : request.getHumanRemark().trim());
        application.setEvaluatedAt(new Timestamp(System.currentTimeMillis()));
        applicationRepository.save(application);

        SubmissionDetailsResponse report = buildSubmissionDetailsResponse(application, evaluation);
        evaluation.setReportPayload(writeJson(report));
        evaluationRepository.save(evaluation);

        notifyTeam(application, finalPercent);
        return report;
    }

    public SubmissionDetailsResponse getEvaluationDetails(Long submissionId) {
        Application application = applicationRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + submissionId));
        Evaluation evaluation = evaluationRepository.findByApplication_Id(submissionId)
                .orElseThrow(() -> new RuntimeException("No evaluation found for submission ID: " + submissionId));
        return buildSubmissionDetailsResponse(application, evaluation);
    }

    public ProblemEvaluationSummaryResponse getEvaluationSummary(Long problemId) {
        List<Application> applications = applicationRepository.findByProblem_ProblemId(problemId);
        List<SubmissionDetailsResponse> results = applications.stream()
                .map(Application::getId)
                .map(id -> {
                    try {
                        return getEvaluationDetails(id);
                    } catch (Exception ignored) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        ProblemEvaluationSummaryResponse summary = new ProblemEvaluationSummaryResponse();
        summary.setProblemId(problemId);
        summary.setProblemTitle(applications.isEmpty() ? "Problem " + problemId : applications.get(0).getProblem().getProblemTitle());
        summary.setSubmissionCount(applications.size());
        summary.setEvaluationCount(results.size());
        summary.setResults(results);
        return summary;
    }

    public SubmissionCountResponse getSubmissionCount(Long problemId) {
        List<Application> applications = applicationRepository.findByProblem_ProblemId(problemId);
        SubmissionCountResponse response = new SubmissionCountResponse();
        response.setProblemId(problemId);
        response.setSubmissionCount(applications.size());
        return response;
    }

    public List<EvaluationCriterionView> getAllEvaluationCriteria() {
        return evaluationCriteriaRepository.findAllByOrderByCriteriaId().stream()
                .map(c -> {
                    EvaluationCriterionView view = new EvaluationCriterionView();
                    view.setCriteriaId(c.getCriteriaId());
                    view.setCriteriaName(c.getCriteriaName());
                    view.setDescription(null);
                    view.setWeightPercentage(c.getWeightPercentage());
                    view.setMaxScore(c.getMaxScore());
                    return view;
                })
                .collect(Collectors.toList());
    }

    public SubmissionDetailsResponse submitEvaluation(EvaluationSubmissionRequest request) {
        Map<String, Double> humanScores = new LinkedHashMap<>();
        for (EvaluationCriterionScoreRequest score : request.getCriteriaScores()) {
            EvaluationCriteria criteria = evaluationCriteriaRepository.findById(score.getCriteriaId())
                    .orElseThrow(() -> new RuntimeException("Criteria not found: " + score.getCriteriaId()));
            humanScores.put(criteria.getCriteriaName(), Math.min(10.0, Math.max(0.0, score.getScore() / 10.0)));
        }

        EvaluationSubmitRequest mapped = new EvaluationSubmitRequest();
        mapped.setSubmissionId(request.getSubmissionId());
        mapped.setEvaluatorId(request.getEvaluatorId());
        mapped.setHumanScores(humanScores);
        mapped.setHumanRemark(request.getOverallReview());

        AiEvaluationRequest aiRequest = new AiEvaluationRequest();
        aiRequest.setSubmissionId(request.getSubmissionId());
        AiEvaluationResponse aiResponse = runAiEvaluation(aiRequest);
        mapped.setAiScores(aiResponse.getAiScores());
        mapped.setAiRemark(aiResponse.getAiRemark());
        return submitUnifiedEvaluation(mapped);
    }

    private SubmissionDetailsResponse buildSubmissionDetailsResponse(Application application, Evaluation evaluation) {
        SubmissionDetailsResponse response = new SubmissionDetailsResponse();
        response.setSubmissionId(application.getId());
        response.setProblemId(application.getProblem().getProblemId());
        response.setProblemTitle(application.getProblem().getProblemTitle());
        response.setProblemTheme(application.getProblem().getTheme());
        response.setProblemStatement(application.getProblem().getProblemDescription());
        response.setProblemStatus(application.getProblem().getStatus());
        response.setTeamId(application.getTeam().getTeamId());
        response.setTeamName(application.getTeam().getTeamName());
        response.setTeamLeaderName(application.getTeam().getLeader() != null ? application.getTeam().getLeader().getFullName() : null);
        response.setTeamMembers(application.getTeam().getMembers().stream().map(TeamMember::getName).filter(Objects::nonNull).collect(Collectors.toList()));
        response.setAbstractText(application.getAbstractText());
        response.setPptLink("/api/applications/" + application.getId() + "/submission-file");
        response.setGithubLink(application.getGithubLink());
        response.setDemoLink(application.getDemoLink());
        response.setApplicationStatus(application.getSubmissionStatus());
        response.setAppliedAt(application.getSubmissionDate());
        response.setEvaluationStatus(evaluation.getEvaluationStatus());
        response.setEvaluationDate(application.getEvaluatedAt());

        Map<String, Double> aiScores = readScoreMap(evaluation.getAiScoresJson());
        Map<String, Double> humanScores = readScoreMap(evaluation.getHumanScoresJson());
        response.setAiScores(aiScores);
        response.setAiRemark(evaluation.getAiRemark());
        response.setHumanScores(humanScores);
        response.setHumanRemark(evaluation.getHumanRemark());

        double aiTotal = aiScores.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double humanTotal = humanScores.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        response.setAiTotalScore(round2(aiTotal));
        response.setHumanTotalScore(round2(humanTotal));
        response.setTotalScore(evaluation.getTotalScore() == null ? round2((aiTotal * 0.4) + (humanTotal * 0.6)) : round2(evaluation.getTotalScore()));
        response.setNormalizedScore(response.getTotalScore());
        response.setOverallReview(evaluation.getComments());
        response.setJudgeName(application.getJudgedBy());
        response.setJudgeScore(application.getJudgeScore() == null ? null : application.getJudgeScore().doubleValue());
        response.setJudgeRemarks(application.getManualRemarks());
        response.setFinalDecision("JUSTIFIED".equalsIgnoreCase(application.getSubmissionStatus()) || "JUDGED".equalsIgnoreCase(application.getSubmissionStatus()) ? "FINALIZED" : "PENDING");

        List<EvaluationScore> scoreRows = evaluationScoreRepository.findByEvaluation_EvaluationId(evaluation.getEvaluationId());
        List<EvaluationCriterionView> criteriaViews = scoreRows.stream().map(s -> {
            EvaluationCriterionView v = new EvaluationCriterionView();
            v.setCriteriaId(s.getCriteria().getCriteriaId());
            v.setCriteriaName(s.getCriteria().getCriteriaName());
            v.setWeightPercentage(s.getCriteria().getWeightPercentage());
            v.setMaxScore(s.getCriteria().getMaxScore());
            v.setScoreValue(s.getScoreValue());
            v.setWeightedScore(s.getWeightedScore());
            return v;
        }).collect(Collectors.toList());
        response.setCriteriaScores(criteriaViews);
        response.setReportJson(evaluation.getReportPayload());
        return response;
    }

    private Map<String, Double> normalizeCriteriaMap(Map<String, Double> incoming) {
        Map<String, Double> result = new LinkedHashMap<>();
        for (String key : STANDARD_CRITERIA) {
            result.put(key, incoming != null && incoming.get(key) != null ? incoming.get(key) : 0.0);
        }
        return result;
    }

    private void validateScores(Map<String, Double> scores, String label) {
        if (scores == null || scores.isEmpty()) {
            throw new RuntimeException(label + " scores are required");
        }
        for (Map.Entry<String, Double> entry : scores.entrySet()) {
            double value = entry.getValue() == null ? -1.0 : entry.getValue();
            if (value < 0.0 || value > 10.0) {
                throw new RuntimeException(label + " score for " + entry.getKey() + " must be between 0 and 10");
            }
        }
    }

    private boolean hasAnyNonZeroScore(Map<String, Double> scores) {
        return scores != null && scores.values().stream().anyMatch(value -> value != null && value > 0.0);
    }

    private void upsertEvaluationScores(Evaluation evaluation, Map<String, Double> humanScores) {
        evaluationScoreRepository.deleteByEvaluation_EvaluationId(evaluation.getEvaluationId());
        List<EvaluationCriteria> criteriaList = evaluationCriteriaRepository.findAllByOrderByCriteriaId();
        Map<String, EvaluationCriteria> byName = criteriaList.stream()
                .collect(Collectors.toMap(c -> c.getCriteriaName().toLowerCase(), c -> c, (a, b) -> a, LinkedHashMap::new));

        List<EvaluationScore> rows = new ArrayList<>();
        for (Map.Entry<String, Double> entry : humanScores.entrySet()) {
            EvaluationCriteria criteria = byName.values().stream()
                    .filter(c -> c.getCriteriaName().equalsIgnoreCase(entry.getKey()))
                    .findFirst()
                    .orElse(criteriaList.isEmpty() ? null : criteriaList.get(0));
            if (criteria == null) {
                continue;
            }

            EvaluationScore score = new EvaluationScore();
            score.setEvaluation(evaluation);
            score.setCriteria(criteria);
            score.setScoreValue(entry.getValue() * 10.0);
            double weighted = (entry.getValue() / 10.0) * (criteria.getWeightPercentage() == null ? 0.0 : criteria.getWeightPercentage());
            score.setWeightedScore(round2(weighted));
            score.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            rows.add(score);
        }
        evaluationScoreRepository.saveAll(rows);
    }

    private Map<String, Double> generateAiScores(Application application) {
        String text = (application.getAbstractText() == null ? "" : application.getAbstractText()).toLowerCase();
        int words = text.trim().isEmpty() ? 0 : text.trim().split("\\s+").length;
        boolean hasGithub = application.getGithubLink() != null && !application.getGithubLink().isBlank();
        boolean hasDemo = application.getDemoLink() != null && !application.getDemoLink().isBlank();
        boolean mentionsAi = text.contains("ai") || text.contains("machine learning") || text.contains("model");
        boolean hasScalabilityWords = text.contains("scale") || text.contains("scalable") || text.contains("growth");

        Map<String, Double> scores = new LinkedHashMap<>();
        scores.put("Innovation", clamp3to10(5 + (mentionsAi ? 2 : 0) + (words > 350 ? 1 : 0)));
        scores.put("Technical Implementation", clamp3to10(5 + (hasGithub ? 2 : 0) + (words > 250 ? 1 : 0)));
        scores.put("Problem Relevance", clamp3to10(5 + (text.contains("problem") ? 1 : 0) + (text.contains("impact") ? 1 : 0)));
        scores.put("Use of AI Tools", clamp3to10(4 + (mentionsAi ? 3 : 0)));
        scores.put("Feasibility", clamp3to10(5 + (hasDemo ? 2 : 0) + (words > 200 ? 1 : 0)));
        scores.put("Scalability", clamp3to10(4 + (hasScalabilityWords ? 3 : 0) + (text.contains("deployment") ? 1 : 0)));
        return scores;
    }

    private String generateAiRemark(Application application, Map<String, Double> scores) {
        String title = application.getProblem() != null ? application.getProblem().getProblemTitle() : "the problem statement";
        double avg = scores.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        return "AI evaluation indicates a balanced submission for " + title + ". The idea demonstrates a meaningful attempt to align with the defined problem scope and offers evidence of solution intent through the abstract and attached artifacts. Innovation and technical implementation are stronger when repository and demonstration references are present, while feasibility and scalability improve with explicit rollout and operational planning. The AI criteria scoring suggests that the concept is directionally sound, but execution depth can be improved by clarifying measurable outcomes, architecture decisions, and validation strategy. Additional detail on edge cases, constraints, and adoption risks would increase confidence for production viability. The current profile supports progression to human review, with focus recommended on implementation clarity and impact quantification. Overall AI average score: " + round2(avg) + "/10.";
    }

    private void notifyTeam(Application application, double finalPercent) {
        try {
            User leader = application.getTeam().getLeader();
            if (leader != null && leader.getUserId() != null) {
                notificationService.createNotification(
                        leader.getUserId(),
                        "Evaluation completed for " + application.getProblem().getProblemTitle() + ". Final score: " + finalPercent + "/100",
                        "EVALUATION_COMPLETED");
            }
        } catch (Exception ignored) {
        }
    }

    private String writeJson(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize evaluation payload");
        }
    }

    private Map<String, Double> readScoreMap(String json) {
        if (json == null || json.isBlank()) {
            return new LinkedHashMap<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Double>>() {});
        } catch (Exception e) {
            return new LinkedHashMap<>();
        }
    }

    private double clamp3to10(double value) {
        return round2(Math.max(3.0, Math.min(10.0, value)));
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
