package com.sih.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class ProblemEvaluationSummaryResponse {
    private Long problemId;
    private String problemTitle;
    private long submissionCount;
    private long evaluationCount;
    private List<SubmissionDetailsResponse> results = new ArrayList<>();

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getProblemTitle() {
        return problemTitle;
    }

    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }

    public long getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(long submissionCount) {
        this.submissionCount = submissionCount;
    }

    public long getEvaluationCount() {
        return evaluationCount;
    }

    public void setEvaluationCount(long evaluationCount) {
        this.evaluationCount = evaluationCount;
    }

    public List<SubmissionDetailsResponse> getResults() {
        return results;
    }

    public void setResults(List<SubmissionDetailsResponse> results) {
        this.results = results;
    }
}
