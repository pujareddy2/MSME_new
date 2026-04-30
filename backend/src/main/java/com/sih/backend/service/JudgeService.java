package com.sih.backend.service;

import com.sih.backend.dto.JudgeFinalizeRequest;
import com.sih.backend.dto.SubmissionDetailsResponse;
import com.sih.backend.model.Application;
import com.sih.backend.model.Evaluation;
import com.sih.backend.model.Judge;
import com.sih.backend.model.User;
import com.sih.backend.repository.ApplicationRepository;
import com.sih.backend.repository.EvaluationRepository;
import com.sih.backend.repository.JudgeRepository;
import com.sih.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.List;
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
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private EvaluationService evaluationService;

    public SubmissionDetailsResponse finalizeProblem(JudgeFinalizeRequest request) {
        Application application = applicationRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new RuntimeException("Application/Submission not found with ID: " + request.getSubmissionId()));
        if (!"EVALUATED".equalsIgnoreCase(application.getSubmissionStatus())) {
            throw new RuntimeException("Cannot judge. Application must be EVALUATED first. Current status: " + application.getSubmissionStatus());
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
        application.setSubmissionStatus("JUDGED");
        application.setEvaluatedAt(new Timestamp(System.currentTimeMillis()));
        applicationRepository.save(application);

        evaluation.setEvaluationStatus("JUDGED");
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

    public List<SubmissionDetailsResponse> getEvaluatedSubmissionsForJudge() {
        return evaluationRepository.findAll().stream()
                .map(Evaluation::getApplication)
                .filter(app -> app != null && ("EVALUATED".equalsIgnoreCase(app.getSubmissionStatus()) || "JUDGED".equalsIgnoreCase(app.getSubmissionStatus())))
                .map(app -> evaluationService.getEvaluationDetails(app.getId()))
                .sorted(Comparator.comparing(SubmissionDetailsResponse::getTotalScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public SubmissionDetailsResponse getEvaluationReport(Long submissionId) {
        return evaluationService.getEvaluationDetails(submissionId);
    }

    public long getPendingJudgmentCount() {
        return applicationRepository.findAll().stream()
                .filter(app -> "EVALUATED".equalsIgnoreCase(app.getSubmissionStatus()))
                .count();
    }
}
