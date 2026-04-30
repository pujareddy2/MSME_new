package com.sih.backend.dto;

public class JudgeFinalizeRequest {
    private Long submissionId;
    private Long judgeUserId;
    private String finalDecision;
    private Double finalScore;
    private String remarks;

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Long getJudgeUserId() {
        return judgeUserId;
    }

    public void setJudgeUserId(Long judgeUserId) {
        this.judgeUserId = judgeUserId;
    }

    public String getFinalDecision() {
        return finalDecision;
    }

    public void setFinalDecision(String finalDecision) {
        this.finalDecision = finalDecision;
    }

    public Double getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(Double finalScore) {
        this.finalScore = finalScore;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
