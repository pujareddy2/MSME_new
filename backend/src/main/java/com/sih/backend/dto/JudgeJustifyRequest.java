package com.sih.backend.dto;

import java.util.LinkedHashMap;
import java.util.Map;

public class JudgeJustifyRequest {
    private Long submissionId;
    private Long judgeUserId;
    private Map<String, Double> judgeScores = new LinkedHashMap<>();
    private String judgeRemark;

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public Long getJudgeUserId() { return judgeUserId; }
    public void setJudgeUserId(Long judgeUserId) { this.judgeUserId = judgeUserId; }
    public Map<String, Double> getJudgeScores() { return judgeScores; }
    public void setJudgeScores(Map<String, Double> judgeScores) { this.judgeScores = judgeScores; }
    public String getJudgeRemark() { return judgeRemark; }
    public void setJudgeRemark(String judgeRemark) { this.judgeRemark = judgeRemark; }
}
