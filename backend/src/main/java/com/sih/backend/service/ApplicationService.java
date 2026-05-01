package com.sih.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.backend.dto.ApplicationCreateRequest;
import com.sih.backend.dto.EvaluationRequest;
import com.sih.backend.dto.JudgingRequest;
import com.sih.backend.dto.ApplicationSummaryResponse;
import com.sih.backend.model.Application;
import com.sih.backend.model.ProblemStatement;
import com.sih.backend.model.Team;
import com.sih.backend.model.User;
import com.sih.backend.repository.ApplicationRepository;
import com.sih.backend.repository.ProblemStatementRepository;
import com.sih.backend.repository.TeamRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {

    private static final long MAX_PRESENTATION_SIZE = 20L * 1024L * 1024L;

    private final ApplicationRepository applicationRepository;
    private final TeamRepository teamRepository;
    private final ProblemStatementRepository problemStatementRepository;
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            TeamRepository teamRepository,
            ProblemStatementRepository problemStatementRepository,
            ObjectMapper objectMapper,
            NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.teamRepository = teamRepository;
        this.problemStatementRepository = problemStatementRepository;
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    public List<ApplicationSummaryResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public ApplicationSummaryResponse getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .map(this::toSummaryResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }

    public Application getApplicationEntityById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }

    @Transactional
    public Application createApplication(String applicationJson, MultipartFile file) {
        ApplicationCreateRequest request;
        try {
            request = objectMapper.readValue(applicationJson, ApplicationCreateRequest.class);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid application payload", exception);
        }

        if (request.getTeamId() == null || request.getProblemId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team ID and Problem ID are required");
        }

        if (request.getAbstractText() == null || request.getAbstractText().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Abstract text is required");
        }

        if (applicationRepository.existsByTeam_TeamIdAndProblem_ProblemId(request.getTeamId(), request.getProblemId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This team has already applied to the selected problem");
        }

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid team ID"));

        ProblemStatement problemStatement = problemStatementRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid problem ID"));

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PPT file is required");
        }

        validatePresentation(file);

        Application application = new Application();
        application.setAbstractText(request.getAbstractText());
        application.setSubmissionVersion(request.getSubmissionVersion() == null || request.getSubmissionVersion().trim().isEmpty()
                ? "v1.0"
                : request.getSubmissionVersion().trim());
        application.setSubmissionStatus("SUBMITTED");
        application.setTechnologyStack(request.getTechnologyStack());
        application.setGithubLink(request.getGithubLink());
        application.setDemoLink(request.getDemoLink());
        application.setTeam(team);
        application.setProblem(problemStatement);

        storePresentationFile(application, file);

        Application savedApplication = applicationRepository.save(application);

        if (team.getLeader() != null && team.getLeader().getUserId() != null) {
            String problemTitle = problemStatement.getProblemTitle() != null && !problemStatement.getProblemTitle().isBlank()
                ? problemStatement.getProblemTitle()
                : "Problem #" + problemStatement.getProblemId();

            notificationService.createNotification(
                team.getLeader().getUserId(),
                "Application submitted for " + problemTitle + " by team " + team.getTeamName() + ".",
                "SUBMISSION_MADE");
        }

        return savedApplication;
    }

    @Transactional
    public Application submitJudging(Long applicationId, JudgingRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if ("JUDGED".equalsIgnoreCase(application.getSubmissionStatus()) && application.getJudgeScore() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Judging has already been completed for this application");
        }

        boolean canProceed = "EVALUATED".equalsIgnoreCase(application.getSubmissionStatus())
                || ("JUDGED".equalsIgnoreCase(application.getSubmissionStatus()) && application.getJudgeScore() == null);

        if (!canProceed) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Application must be evaluated before judging");
        }

        if (request.getJudgedBy() == null || request.getJudgedBy().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Judge name is required");
        }

        if (request.getManualScore() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Judge score is required");
        }

        if (request.getManualScore() < 0 || request.getManualScore() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Judge score must be between 0 and 100");
        }

        application.setJudgedBy(request.getJudgedBy().trim());
        application.setJudgeScore(request.getManualScore());
        application.setEvaluatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
        application.setSubmissionStatus("JUDGED");

        Application saved = applicationRepository.save(application);

        if (saved.getTeam() != null && saved.getTeam().getLeader() != null && saved.getTeam().getLeader().getUserId() != null) {
            String problemTitle = saved.getProblem() != null && saved.getProblem().getProblemTitle() != null && !saved.getProblem().getProblemTitle().isBlank()
                    ? saved.getProblem().getProblemTitle()
                    : "Problem #" + (saved.getProblem() != null ? saved.getProblem().getProblemId() : "N/A");

            notificationService.createNotification(
                    saved.getTeam().getLeader().getUserId(),
                    "Judging completed for " + problemTitle + " (Team: " + saved.getTeam().getTeamName() + ").",
                    "EVALUATION_COMPLETED");
        }

        return saved;
    }

    @Transactional
    public Application submitEvaluation(Long applicationId, EvaluationRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if ("EVALUATED".equalsIgnoreCase(application.getSubmissionStatus())
            || "JUDGED".equalsIgnoreCase(application.getSubmissionStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Evaluation has already been completed for this application");
        }

        if (request.getAiScore() == null || request.getAiScore() < 0 || request.getAiScore() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "AI score must be between 0 and 100");
        }

        if (request.getAiRemarks() == null || request.getAiRemarks().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "AI remarks are required");
        }

        if (request.getManualScore() == null || request.getManualScore() < 0 || request.getManualScore() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Manual score must be between 0 and 100");
        }

        if (request.getManualRemarks() == null || request.getManualRemarks().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Manual remarks are required");
        }

        application.setAiScore(request.getAiScore());
        application.setAiRemarks(request.getAiRemarks().trim());
        application.setManualScore(request.getManualScore());
        application.setManualRemarks(request.getManualRemarks().trim());
        application.setSubmissionStatus("EVALUATED");
        application.setEvaluatedAt(new java.sql.Timestamp(System.currentTimeMillis()));

        Application saved = applicationRepository.save(application);
        if (saved.getTeam() != null && saved.getTeam().getLeader() != null && saved.getTeam().getLeader().getUserId() != null) {
            notificationService.createNotification(
                    saved.getTeam().getLeader().getUserId(),
                    "New AI-based insight generated: " + request.getAiRemarks().trim(),
                    "AI_INSIGHT");
        }
        return saved;
    }

    private void validatePresentation(MultipartFile file) {
        if (file.getSize() > MAX_PRESENTATION_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PPT file must be 20MB or smaller");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid PPT file name");
        }

        String lowerName = originalName.toLowerCase();
        if (!lowerName.endsWith(".ppt") && !lowerName.endsWith(".pptx") && !lowerName.endsWith(".pdf")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PPT, PPTX, or PDF files are allowed");
        }
    }

    private void storePresentationFile(Application application, MultipartFile file) {
        try {
            Path uploadDirectory = Paths.get("uploads", "applications");
            Files.createDirectories(uploadDirectory);

            String originalName = Path.of(file.getOriginalFilename()).getFileName().toString();
            String storedName = UUID.randomUUID() + "_" + originalName;
            Path destination = uploadDirectory.resolve(storedName);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }

            application.setPptFileName(originalName);
            application.setPptFilePath(destination.toAbsolutePath().toString());
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store PPT file", exception);
        }
    }

    private ApplicationSummaryResponse toSummaryResponse(Application application) {
        ApplicationSummaryResponse response = new ApplicationSummaryResponse();
        response.setApplicationId(application.getId());
        response.setAbstractText(application.getAbstractText());
        response.setSubmissionVersion(application.getSubmissionVersion());
        response.setSubmissionStatus(application.getSubmissionStatus());
        response.setSubmissionDate(application.getSubmissionDate());
        response.setPptFileName(application.getPptFileName());
        response.setTechnologyStack(application.getTechnologyStack());
        response.setGithubLink(application.getGithubLink());
        response.setDemoLink(application.getDemoLink());
        response.setAiScore(application.getAiScore());
        response.setAiRemarks(application.getAiRemarks());
        response.setManualScore(application.getManualScore());
        response.setManualRemarks(application.getManualRemarks());
        response.setJudgeScore(application.getJudgeScore());
        response.setJudgedBy(application.getJudgedBy());
        response.setEvaluatedAt(application.getEvaluatedAt());
        response.setTeam(toTeamSummary(application.getTeam()));
        response.setProblem(toProblemSummary(application.getProblem()));
        return response;
    }

    private ApplicationSummaryResponse.TeamSummary toTeamSummary(Team team) {
        if (team == null) {
            return null;
        }

        ApplicationSummaryResponse.TeamSummary response = new ApplicationSummaryResponse.TeamSummary();
        response.setTeamId(team.getTeamId());
        response.setTeamName(team.getTeamName());
        response.setLeader(toLeaderSummary(team.getLeader()));
        return response;
    }

    private ApplicationSummaryResponse.LeaderSummary toLeaderSummary(User leader) {
        if (leader == null) {
            return null;
        }

        ApplicationSummaryResponse.LeaderSummary response = new ApplicationSummaryResponse.LeaderSummary();
        response.setUserId(leader.getUserId());
        response.setFullName(leader.getFullName());
        response.setEmail(leader.getEmail());
        response.setPhoneNumber(leader.getPhoneNumber());
        return response;
    }

    private ApplicationSummaryResponse.ProblemSummary toProblemSummary(ProblemStatement problem) {
        if (problem == null) {
            return null;
        }

        ApplicationSummaryResponse.ProblemSummary response = new ApplicationSummaryResponse.ProblemSummary();
        response.setProblemId(problem.getProblemId());
        response.setCustomProblemId(problem.getCustomProblemId());
        response.setProblemTitle(problem.getProblemTitle());
        response.setProblemDescription(problem.getProblemDescription());
        response.setTheme(problem.getTheme());
        response.setDomain(problem.getDomain());
        response.setStatus(problem.getStatus());
        return response;
    }
}
