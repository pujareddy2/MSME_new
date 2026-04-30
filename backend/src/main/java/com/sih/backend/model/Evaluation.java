package com.sih.backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id")
    private Long evaluationId;

    @Column(name = "evaluation_status")
    private String evaluationStatus;

    @Column(name = "comments", columnDefinition = "LONGTEXT")
    private String comments;

    @Column(name = "ai_scores", columnDefinition = "LONGTEXT")
    private String aiScoresJson;

    @Column(name = "ai_remark", columnDefinition = "LONGTEXT")
    private String aiRemark;

    @Column(name = "human_scores", columnDefinition = "LONGTEXT")
    private String humanScoresJson;

    @Column(name = "human_remark", columnDefinition = "LONGTEXT")
    private String humanRemark;

    @Column(name = "total_score")
    private Double totalScore;

    @Column(name = "report_payload", columnDefinition = "LONGTEXT")
    private String reportPayload;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // 🔹 APPLICATION LINK
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    // 🔹 JUDGE LINK
    @ManyToOne
    @JoinColumn(name = "judge_id")
    private Judge judge;

    // 🔹 ROUND LINK
    @ManyToOne
    @JoinColumn(name = "round_id")
    private Round round;

    // 🔹 SELF REFERENCE (review system)
    @ManyToOne
    @JoinColumn(name = "parent_evaluation_id")
    private Evaluation parentEvaluation;

    // ---------------- GETTERS & SETTERS ----------------

    public Long getEvaluationId() {
        return evaluationId;
    }

    public void setEvaluationId(Long evaluationId) {
        this.evaluationId = evaluationId;
    }

    public String getEvaluationStatus() {
        return evaluationStatus;
    }

    public void setEvaluationStatus(String evaluationStatus) {
        this.evaluationStatus = evaluationStatus;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getAiScoresJson() {
        return aiScoresJson;
    }

    public void setAiScoresJson(String aiScoresJson) {
        this.aiScoresJson = aiScoresJson;
    }

    public String getAiRemark() {
        return aiRemark;
    }

    public void setAiRemark(String aiRemark) {
        this.aiRemark = aiRemark;
    }

    public String getHumanScoresJson() {
        return humanScoresJson;
    }

    public void setHumanScoresJson(String humanScoresJson) {
        this.humanScoresJson = humanScoresJson;
    }

    public String getHumanRemark() {
        return humanRemark;
    }

    public void setHumanRemark(String humanRemark) {
        this.humanRemark = humanRemark;
    }

    public Double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }

    public String getReportPayload() {
        return reportPayload;
    }

    public void setReportPayload(String reportPayload) {
        this.reportPayload = reportPayload;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public Judge getJudge() {
        return judge;
    }

    public void setJudge(Judge judge) {
        this.judge = judge;
    }

    public Round getRound() {
        return round;
    }

    public void setRound(Round round) {
        this.round = round;
    }

    public Evaluation getParentEvaluation() {
        return parentEvaluation;
    }

    public void setParentEvaluation(Evaluation parentEvaluation) {
        this.parentEvaluation = parentEvaluation;
    }
}
