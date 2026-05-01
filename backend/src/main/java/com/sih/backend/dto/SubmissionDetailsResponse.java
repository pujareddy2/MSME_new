package com.sih.backend.dto;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class SubmissionDetailsResponse {
    private Long submissionId;
    private Long problemId;
    private String problemTitle;
    private String problemTheme;
    private String problemStatement;
    private String problemStatus;
    private Long teamId;
    private String teamName;
    private String teamLeaderName;
    private List<String> teamMembers = new ArrayList<>();
    private String abstractText;
    private String pptLink;
    private String githubLink;
    private String demoLink;
    private String applicationStatus;
    private java.sql.Timestamp appliedAt;
    private Long evaluatorId;
    private String evaluatorName;
    private Map<String, Double> aiScores = new LinkedHashMap<>();
    private String aiRemark;
    private Double aiTotalScore;
    private Map<String, Double> humanScores = new LinkedHashMap<>();
    private String humanRemark;
    private Double humanTotalScore;
    private String overallReview;
    private String evaluationStatus;
    private Double totalScore;
    private Double normalizedScore;
    private Long judgeId;
    private String judgeName;
    private Double judgeScore;
    private String finalDecision;
    private String judgeRemarks;
    private Map<String, Double> judgeScores = new LinkedHashMap<>();
    private Long judgeReportId;
    private java.sql.Timestamp evaluationDate;
    private java.sql.Timestamp justificationDate;
    private String reportJson;
    private List<EvaluationCriterionView> criteriaScores = new ArrayList<>();

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getProblemTheme() { return problemTheme; }

    public void setProblemTheme(String problemTheme) { this.problemTheme = problemTheme; }

    public String getProblemTitle() {
        return problemTitle;
    }

    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }

    public String getProblemStatement() {
        return problemStatement;
    }

    public void setProblemStatement(String problemStatement) {
        this.problemStatement = problemStatement;
    }

    public String getProblemStatus() {
        return problemStatus;
    }

    public void setProblemStatus(String problemStatus) {
        this.problemStatus = problemStatus;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamLeaderName() { return teamLeaderName; }

    public void setTeamLeaderName(String teamLeaderName) { this.teamLeaderName = teamLeaderName; }

    public List<String> getTeamMembers() { return teamMembers; }

    public void setTeamMembers(List<String> teamMembers) { this.teamMembers = teamMembers; }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public String getPptLink() {
        return pptLink;
    }

    public void setPptLink(String pptLink) {
        this.pptLink = pptLink;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }

    public String getDemoLink() {
        return demoLink;
    }

    public void setDemoLink(String demoLink) {
        this.demoLink = demoLink;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public java.sql.Timestamp getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(java.sql.Timestamp appliedAt) {
        this.appliedAt = appliedAt;
    }

    public Long getEvaluatorId() {
        return evaluatorId;
    }

    public void setEvaluatorId(Long evaluatorId) {
        this.evaluatorId = evaluatorId;
    }

    public String getEvaluatorName() {
        return evaluatorName;
    }

    public void setEvaluatorName(String evaluatorName) {
        this.evaluatorName = evaluatorName;
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

    public Double getAiTotalScore() {
        return aiTotalScore;
    }

    public void setAiTotalScore(Double aiTotalScore) {
        this.aiTotalScore = aiTotalScore;
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

    public Double getHumanTotalScore() {
        return humanTotalScore;
    }

    public void setHumanTotalScore(Double humanTotalScore) {
        this.humanTotalScore = humanTotalScore;
    }

    public String getOverallReview() {
        return overallReview;
    }

    public void setOverallReview(String overallReview) {
        this.overallReview = overallReview;
    }

    public String getEvaluationStatus() {
        return evaluationStatus;
    }

    public void setEvaluationStatus(String evaluationStatus) {
        this.evaluationStatus = evaluationStatus;
    }

    public Double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }

    public Double getNormalizedScore() {
        return normalizedScore;
    }

    public void setNormalizedScore(Double normalizedScore) {
        this.normalizedScore = normalizedScore;
    }

    public Long getJudgeId() {
        return judgeId;
    }

    public void setJudgeId(Long judgeId) {
        this.judgeId = judgeId;
    }

    public String getJudgeName() {
        return judgeName;
    }

    public void setJudgeName(String judgeName) {
        this.judgeName = judgeName;
    }

    public Double getJudgeScore() {
        return judgeScore;
    }

    public void setJudgeScore(Double judgeScore) {
        this.judgeScore = judgeScore;
    }

    public String getFinalDecision() {
        return finalDecision;
    }

    public void setFinalDecision(String finalDecision) {
        this.finalDecision = finalDecision;
    }

    public String getJudgeRemarks() {
        return judgeRemarks;
    }

    public void setJudgeRemarks(String judgeRemarks) {
        this.judgeRemarks = judgeRemarks;
    }

    public Map<String, Double> getJudgeScores() { return judgeScores; }

    public void setJudgeScores(Map<String, Double> judgeScores) { this.judgeScores = judgeScores; }

    public Long getJudgeReportId() { return judgeReportId; }

    public void setJudgeReportId(Long judgeReportId) { this.judgeReportId = judgeReportId; }

    public java.sql.Timestamp getEvaluationDate() { return evaluationDate; }

    public void setEvaluationDate(java.sql.Timestamp evaluationDate) { this.evaluationDate = evaluationDate; }

    public java.sql.Timestamp getJustificationDate() { return justificationDate; }

    public void setJustificationDate(java.sql.Timestamp justificationDate) { this.justificationDate = justificationDate; }

    public String getReportJson() {
        return reportJson;
    }

    public void setReportJson(String reportJson) {
        this.reportJson = reportJson;
    }

    public List<EvaluationCriterionView> getCriteriaScores() {
        return criteriaScores;
    }

    public void setCriteriaScores(List<EvaluationCriterionView> criteriaScores) {
        this.criteriaScores = criteriaScores;
    }
}
