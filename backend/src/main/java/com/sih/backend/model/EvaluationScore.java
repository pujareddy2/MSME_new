package com.sih.backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "evaluation_scores")
public class EvaluationScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")
    private Long scoreId;

    @Column(name = "score_value")
    private Double scoreValue;

    @Column(name = "weighted_score")
    private Double weightedScore;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // 🔹 LINK TO EVALUATION
    @ManyToOne
    @JoinColumn(name = "evaluation_id")
    private Evaluation evaluation;

    // 🔹 LINK TO CRITERIA
    @ManyToOne
    @JoinColumn(name = "criteria_id")
    private EvaluationCriteria criteria;

    // ---------------- GETTERS & SETTERS ----------------

    public Long getScoreId() {
        return scoreId;
    }

    public void setScoreId(Long scoreId) {
        this.scoreId = scoreId;
    }

    public Double getScoreValue() {
        return scoreValue;
    }

    public void setScoreValue(Double scoreValue) {
        this.scoreValue = scoreValue;
    }

    public Double getWeightedScore() {
        return weightedScore;
    }

    public void setWeightedScore(Double weightedScore) {
        this.weightedScore = weightedScore;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Evaluation getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Evaluation evaluation) {
        this.evaluation = evaluation;
    }

    public EvaluationCriteria getCriteria() {
        return criteria;
    }

    public void setCriteria(EvaluationCriteria criteria) {
        this.criteria = criteria;
    }
}