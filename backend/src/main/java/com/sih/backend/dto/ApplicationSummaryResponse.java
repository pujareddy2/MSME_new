package com.sih.backend.dto;

import java.sql.Timestamp;

public class ApplicationSummaryResponse {

    private Long applicationId;
    private String abstractText;
    private String submissionVersion;
    private String submissionStatus;
    private Timestamp submissionDate;
    private String pptFileName;
    private String technologyStack;
    private String githubLink;
    private String demoLink;
    private Integer aiScore;
    private String aiRemarks;
    private Integer manualScore;
    private String manualRemarks;
    private Integer judgeScore;
    private String judgedBy;
    private Timestamp evaluatedAt;
    private TeamSummary team;
    private ProblemSummary problem;

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
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

    public Integer getJudgeScore() {
        return judgeScore;
    }

    public void setJudgeScore(Integer judgeScore) {
        this.judgeScore = judgeScore;
    }

    public String getJudgedBy() {
        return judgedBy;
    }

    public void setJudgedBy(String judgedBy) {
        this.judgedBy = judgedBy;
    }

    public Timestamp getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(Timestamp evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }

    public TeamSummary getTeam() {
        return team;
    }

    public void setTeam(TeamSummary team) {
        this.team = team;
    }

    public ProblemSummary getProblem() {
        return problem;
    }

    public void setProblem(ProblemSummary problem) {
        this.problem = problem;
    }

    public static class TeamSummary {
        private Long teamId;
        private String teamName;
        private LeaderSummary leader;

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

        public LeaderSummary getLeader() {
            return leader;
        }

        public void setLeader(LeaderSummary leader) {
            this.leader = leader;
        }
    }

    public static class LeaderSummary {
        private Long userId;
        private String fullName;
        private String email;
        private String phoneNumber;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }

    public static class ProblemSummary {
        private Long problemId;
        private String customProblemId;
        private String problemTitle;
        private String problemDescription;
        private String theme;
        private String domain;
        private String status;

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

        public String getTheme() {
            return theme;
        }

        public void setTheme(String theme) {
            this.theme = theme;
        }

        public String getDomain() {
            return domain;
        }

        public void setDomain(String domain) {
            this.domain = domain;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}