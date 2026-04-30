package com.sih.backend.dto;

import java.util.LinkedHashMap;
import java.util.Map;

public class AiEvaluationResponse {
    private Long submissionId;
    private Map<String, Double> aiScores = new LinkedHashMap<>();
    private Double aiTotalScore;
    private String aiRemark;

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Map<String, Double> getAiScores() {
        return aiScores;
    }

    public void setAiScores(Map<String, Double> aiScores) {
        this.aiScores = aiScores;
    }

    public Double getAiTotalScore() {
        return aiTotalScore;
    }

    public void setAiTotalScore(Double aiTotalScore) {
        this.aiTotalScore = aiTotalScore;
    }

    public String getAiRemark() {
        return aiRemark;
    }

    public void setAiRemark(String aiRemark) {
        this.aiRemark = aiRemark;
    }
}
