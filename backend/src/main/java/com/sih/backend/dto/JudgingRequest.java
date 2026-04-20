package com.sih.backend.dto;

public class JudgingRequest {
    private Integer manualScore;
    private String manualRemarks;
    private String judgedBy;
    private String timestamp;

    public Integer getManualScore() {
        return manualScore;
    }

    public void setManualScore(Integer manualScore) {
        this.manualScore = manualScore;
    }

    public String getManualRemarks() {
        return manualRemarks;
    }

    public void setManualRemarks(String manualRemarks) {
        this.manualRemarks = manualRemarks;
    }

    public String getJudgedBy() {
        return judgedBy;
    }

    public void setJudgedBy(String judgedBy) {
        this.judgedBy = judgedBy;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
