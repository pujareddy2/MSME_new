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

    @Column(name = "comments")
    private String comments;

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