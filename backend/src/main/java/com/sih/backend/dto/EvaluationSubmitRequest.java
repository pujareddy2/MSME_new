package com.sih.backend.dto;

import java.util.LinkedHashMap;
import java.util.Map;

public class EvaluationSubmitRequest {
    private Long submissionId;
    private Long evaluatorId;
    private Map<String, Double> aiScores = new LinkedHashMap<>();
    private String aiRemark;
    private Map<String, Double> humanScores = new LinkedHashMap<>();
    private String humanRemark;

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Long getEvaluatorId() {
        return evaluatorId;
    }

    public void setEvaluatorId(Long evaluatorId) {
        this.evaluatorId = evaluatorId;
    }

    public Map<String, Double> getAiScores() {
        return aiScores;
    }

    public void setAiScores(Map<String, Double> aiScores) {
        this.aiScores = aiScores;
    }

    public String getAiRemark() {
        return aiRemark;
    }

    public void setAiRemark(String aiRemark) {
        this.aiRemark = aiRemark;
    }

    public Map<String, Double> getHumanScores() {
        return humanScores;
    }

    public void setHumanScores(Map<String, Double> humanScores) {
        this.humanScores = humanScores;
    }

    public String getHumanRemark() {
        return humanRemark;
    }

    public void setHumanRemark(String humanRemark) {
        this.humanRemark = humanRemark;
    }
}
