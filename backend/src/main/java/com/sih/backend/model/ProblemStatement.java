package com.sih.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problem_statements")
public class ProblemStatement {

    @Id
    @Column(name = "problem_id")
    private Long problemId;

    @Column(name = "custom_problem_id", unique = true, nullable = true)
    private String customProblemId;  // e.g., "NV01", "NV02"

    @Column(name = "problem_title")
    private String problemTitle;

    @Column(name = "problem_description", columnDefinition = "LONGTEXT")
    private String problemDescription;

    private String domain;

    @Column(name = "theme")
    private String theme;

    @Column(name = "status")
    private String status;

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

    @JsonIgnore
    @OneToMany(mappedBy = "problem")
    private List<Application> applications = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "problem")
    private List<Team> teams = new ArrayList<>();

    // ---------------- GETTERS & SETTERS ----------------

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getCustomProblemId() {
        return customProblemId;
    }

    public void setCustomProblemId(String customProblemId) {
        this.customProblemId = customProblemId;
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

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public List<Application> getApplications() {
        return applications;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }

    public List<Team> getTeams() {
        return teams;
    }

    public void setTeams(List<Team> teams) {
        this.teams = teams;
    }
}
