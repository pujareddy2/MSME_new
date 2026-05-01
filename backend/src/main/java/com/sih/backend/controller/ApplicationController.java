package com.sih.backend.controller;

import com.sih.backend.dto.EvaluationRequest;
import com.sih.backend.dto.JudgingRequest;
import com.sih.backend.dto.ApplicationSummaryResponse;
import com.sih.backend.model.Application;
import com.sih.backend.service.ApplicationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Application> createApplication(
            @RequestPart("application") String application,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.createApplication(application, file));
    }

    @GetMapping
    public List<ApplicationSummaryResponse> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ApplicationSummaryResponse getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @PutMapping("/{id}/judging")
    public Application submitJudging(@PathVariable Long id, @RequestBody JudgingRequest request) {
        return applicationService.submitJudging(id, request);
    }

    @PutMapping("/{id}/evaluation")
    public Application submitEvaluation(@PathVariable Long id, @RequestBody EvaluationRequest request) {
        return applicationService.submitEvaluation(id, request);
    }

    @GetMapping("/{id}/submission-file")
    public ResponseEntity<Resource> viewSubmissionFile(@PathVariable Long id) {
        Application application = applicationService.getApplicationEntityById(id);
        if (application.getPptFilePath() == null || application.getPptFilePath().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(application.getPptFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        FileSystemResource resource = new FileSystemResource(file);
        String lower = file.getName().toLowerCase();
        String mediaType = lower.endsWith(".pdf")
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.presentationml.presentation";

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType(mediaType))
                .body(resource);
    }
}