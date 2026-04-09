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

    @Column(name = "submission_date")
    private Timestamp submissionDate;

    @Column(name = "ppt_file_name")
    private String pptFileName;

    @Column(name = "ppt_file_path")
    private String pptFilePath;

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