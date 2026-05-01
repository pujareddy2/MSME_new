package com.sih.backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "judge_reports")
public class JudgeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Application submission;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private ProblemStatement problem;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Evaluation evaluation;

    @Column(name = "ai_scores", columnDefinition = "LONGTEXT")
    private String aiScores;

    @Column(name = "human_scores", columnDefinition = "LONGTEXT")
    private String humanScores;

    @Column(name = "judge_scores", columnDefinition = "LONGTEXT")
    private String judgeScores;

    @Column(name = "ai_remark", columnDefinition = "LONGTEXT")
    private String aiRemark;

    @Column(name = "human_remark", columnDefinition = "LONGTEXT")
    private String humanRemark;

    @Column(name = "judge_remark", columnDefinition = "LONGTEXT")
    private String judgeRemark;

    @Column(name = "final_score")
    private Double finalScore;

    @Column(name = "submission_date")
    private Timestamp submissionDate;

    @Column(name = "evaluation_date")
    private Timestamp evaluationDate;

    @Column(name = "justification_date")
    private Timestamp justificationDate;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @PrePersist
    public void prePersist() {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    public Long getId() { return id; }
    public Application getSubmission() { return submission; }
    public void setSubmission(Application submission) { this.submission = submission; }
    public ProblemStatement getProblem() { return problem; }
    public void setProblem(ProblemStatement problem) { this.problem = problem; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    public Evaluation getEvaluation() { return evaluation; }
    public void setEvaluation(Evaluation evaluation) { this.evaluation = evaluation; }
    public String getAiScores() { return aiScores; }
    public void setAiScores(String aiScores) { this.aiScores = aiScores; }
    public String getHumanScores() { return humanScores; }
    public void setHumanScores(String humanScores) { this.humanScores = humanScores; }
    public String getJudgeScores() { return judgeScores; }
    public void setJudgeScores(String judgeScores) { this.judgeScores = judgeScores; }
    public String getAiRemark() { return aiRemark; }
    public void setAiRemark(String aiRemark) { this.aiRemark = aiRemark; }
    public String getHumanRemark() { return humanRemark; }
    public void setHumanRemark(String humanRemark) { this.humanRemark = humanRemark; }
    public String getJudgeRemark() { return judgeRemark; }
    public void setJudgeRemark(String judgeRemark) { this.judgeRemark = judgeRemark; }
    public Double getFinalScore() { return finalScore; }
    public void setFinalScore(Double finalScore) { this.finalScore = finalScore; }
    public Timestamp getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(Timestamp submissionDate) { this.submissionDate = submissionDate; }
    public Timestamp getEvaluationDate() { return evaluationDate; }
    public void setEvaluationDate(Timestamp evaluationDate) { this.evaluationDate = evaluationDate; }
    public Timestamp getJustificationDate() { return justificationDate; }
    public void setJustificationDate(Timestamp justificationDate) { this.justificationDate = justificationDate; }
    public Timestamp getCreatedAt() { return createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
}
