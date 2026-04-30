package com.sih.backend.dto;

public class SubmissionCountResponse {
    private Long problemId;
    private long submissionCount;

    public SubmissionCountResponse() {
    }

    public SubmissionCountResponse(Long problemId, long submissionCount) {
        this.problemId = problemId;
        this.submissionCount = submissionCount;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public long getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(long submissionCount) {
        this.submissionCount = submissionCount;
    }
}
