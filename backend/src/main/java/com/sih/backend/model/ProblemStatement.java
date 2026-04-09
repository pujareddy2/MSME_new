package com.sih.backend.model;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "problem_statements")
public class ProblemStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id")
    private Long problemId;

    @Column(name = "problem_title")
    private String problemTitle;

    @Column(name = "problem_description")
    private String problemDescription;

    private String domain;

    @Column(name = "organization_name")
    private String organizationName;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "submission_deadline")
    private Date submissionDeadline;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // 🔹 SELF REFERENCE (parent problem)
    @ManyToOne
    @JoinColumn(name = "parent_problem_id")
    private ProblemStatement parentProblem;

    // 🔹 CREATED BY ADMIN (User)
    @ManyToOne
    @JoinColumn(name = "created_by_admin_id")
    private User createdBy;

    // ---------------- GETTERS & SETTERS ----------------

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

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Date getSubmissionDeadline() {
        return submissionDeadline;
    }

    public void setSubmissionDeadline(Date submissionDeadline) {
        this.submissionDeadline = submissionDeadline;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public ProblemStatement getParentProblem() {
        return parentProblem;
    }

    public void setParentProblem(ProblemStatement parentProblem) {
        this.parentProblem = parentProblem;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}