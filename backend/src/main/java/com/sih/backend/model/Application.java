package com.sih.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.sql.Timestamp;

@Entity
@Table(
        name = "applications",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_application_team_problem",
                columnNames = {"team_id", "problem_id"}
        )
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "abstract_text", columnDefinition = "TEXT")
    private String abstractText;

    @Column(name = "submission_version")
    private String submissionVersion;

    @Column(name = "submission_status")
    private String submissionStatus;

    @Column(name = "submission_date")
    private Timestamp submissionDate;

    @Column(name = "ppt_file_name")
    private String pptFileName;

    @Column(name = "ppt_file_path")
    private String pptFilePath;

    @Column(name = "technology_stack", columnDefinition = "TEXT")
    private String technologyStack;

    @Column(name = "github_link")
    private String githubLink;

    @Column(name = "demo_link")
    private String demoLink;

    @Column(name = "ai_score")
    private Integer aiScore;

    @Column(name = "ai_remarks", columnDefinition = "TEXT")
    private String aiRemarks;

    @Column(name = "manual_score")
    private Integer manualScore;

    @Column(name = "manual_remarks", columnDefinition = "TEXT")
    private String manualRemarks;

    @Column(name = "judge_score")
    private Integer judgeScore;

    @Column(name = "judged_by")
    private String judgedBy;

    @Column(name = "evaluated_at")
    private Timestamp evaluatedAt;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private ProblemStatement problem;

    @PrePersist
    public void prePersist() {
        if (submissionDate == null) {
            submissionDate = new Timestamp(System.currentTimeMillis());
        }
    }

    public Long getId() {
        return id;
    }

    public Long getApplicationId() {
        return id;
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public String getSubmissionVersion() {
        return submissionVersion;
    }

    public void setSubmissionVersion(String submissionVersion) {
        this.submissionVersion = submissionVersion;
    }

    public String getSubmissionStatus() {
        return submissionStatus;
    }

    public void setSubmissionStatus(String submissionStatus) {
        this.submissionStatus = submissionStatus;
    }

    public Timestamp getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(Timestamp submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getPptFileName() {
        return pptFileName;
    }

    public void setPptFileName(String pptFileName) {
        this.pptFileName = pptFileName;
    }

    public String getPptFilePath() {
        return pptFilePath;
    }

    public void setPptFilePath(String pptFilePath) {
        this.pptFilePath = pptFilePath;
    }

    public String getTechnologyStack() {
        return technologyStack;
    }

    public void setTechnologyStack(String technologyStack) {
        this.technologyStack = technologyStack;
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

    public Integer getAiScore() {
        return aiScore;
    }

    public void setAiScore(Integer aiScore) {
        this.aiScore = aiScore;
    }

    public String getAiRemarks() {
        return aiRemarks;
    }

    public void setAiRemarks(String aiRemarks) {
        this.aiRemarks = aiRemarks;
    }

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

    public Integer getJudgeScore() {
        return judgeScore;
    }

    public void setJudgeScore(Integer judgeScore) {
        this.judgeScore = judgeScore;
    }

    public Double getFinalScore() {
        if (aiScore == null || manualScore == null) {
            return null;
        }

        return Math.round((aiScore * 0.3 + manualScore * 0.7) * 100.0) / 100.0;
    }

    public Timestamp getEvaluatedAt() {
        return evaluatedAt;
    }

    public Timestamp getTimestamp() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(Timestamp evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public ProblemStatement getProblem() {
        return problem;
    }

    public void setProblem(ProblemStatement problem) {
        this.problem = problem;
    }
}