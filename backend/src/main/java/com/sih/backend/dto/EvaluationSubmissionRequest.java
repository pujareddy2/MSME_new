package com.sih.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class EvaluationSubmissionRequest {
    private Long submissionId;
    private Long evaluatorId;
    private String overallReview;
    private List<EvaluationCriterionScoreRequest> criteriaScores = new ArrayList<>();

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

    public String getOverallReview() {
        return overallReview;
    }

    public void setOverallReview(String overallReview) {
        this.overallReview = overallReview;
    }

    public List<EvaluationCriterionScoreRequest> getCriteriaScores() {
        return criteriaScores;
    }

    public void setCriteriaScores(List<EvaluationCriterionScoreRequest> criteriaScores) {
        this.criteriaScores = criteriaScores;
    }
}
