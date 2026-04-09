package com.sih.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.backend.dto.ApplicationCreateRequest;
import com.sih.backend.model.Application;
import com.sih.backend.model.ProblemStatement;
import com.sih.backend.model.Team;
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

    public ApplicationService(
            ApplicationRepository applicationRepository,
            TeamRepository teamRepository,
            ProblemStatementRepository problemStatementRepository,
            ObjectMapper objectMapper) {
        this.applicationRepository = applicationRepository;
        this.teamRepository = teamRepository;
        this.problemStatementRepository = problemStatementRepository;
        this.objectMapper = objectMapper;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
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
        application.setTeam(team);
        application.setProblem(problemStatement);

        storePresentationFile(application, file);

        return applicationRepository.save(application);
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
        if (!lowerName.endsWith(".ppt") && !lowerName.endsWith(".pptx")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PPT or PPTX files are allowed");
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
}