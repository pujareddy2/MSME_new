package com.sih.backend.config;

import com.sih.backend.model.ProblemStatement;
import com.sih.backend.repository.ProblemStatementRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProblemStatementRepository problemStatementRepository;

    public DataInitializer(ProblemStatementRepository problemStatementRepository) {
        this.problemStatementRepository = problemStatementRepository;
    }

    @Override
    public void run(String... args) {
        Set<Long> existingIds = new HashSet<>();
        problemStatementRepository.findAll().forEach(problem -> existingIds.add(problem.getProblemId()));

        for (ProblemStatement problemStatement : createDefaultProblems()) {
            if (!existingIds.contains(problemStatement.getProblemId())) {
                problemStatementRepository.save(problemStatement);
            }
        }
    }

    private List<ProblemStatement> createDefaultProblems() {
        List<ProblemStatement> problems = new ArrayList<>();
        problems.add(buildProblem(1L, "AI Based Crop Disease Detection", "Software", "Artificial Intelligence", "2025-07-20"));
        problems.add(buildProblem(2L, "Smart Irrigation Monitoring System", "Hardware", "Agriculture", "2025-07-22"));
        problems.add(buildProblem(3L, "AI Based Hackathon Market Prediction", "Software", "Artificial Intelligence", "2025-07-25"));
        problems.add(buildProblem(4L, "Blockchain for Hackathon Supply Chain Transparency", "Software", "Cyber Security", "2025-07-28"));
        problems.add(buildProblem(5L, "Smart Waste Management using IoT", "Hardware", "Smart Cities", "2025-07-30"));
        problems.add(buildProblem(6L, "AI Powered Financial Risk Assessment for Hackathons", "Software", "FinTech", "2025-07-20"));
        problems.add(buildProblem(7L, "Automated Hackathon Loan Eligibility System", "Software", "FinTech", "2025-07-21"));
        problems.add(buildProblem(8L, "AI Chatbot for Hackathon Government Schemes", "Software", "Artificial Intelligence", "2025-07-23"));
        problems.add(buildProblem(9L, "Smart Traffic Monitoring System", "Hardware", "Smart Cities", "2025-07-24"));
        problems.add(buildProblem(10L, "AI Based Job Recommendation System", "Software", "Smart Education", "2025-07-26"));
        problems.add(buildProblem(11L, "Digital Platform for Hackathon Vendor Discovery", "Software", "E-Commerce", "2025-07-27"));
        problems.add(buildProblem(12L, "IoT Based Smart Water Meter", "Hardware", "Smart Cities", "2025-07-29"));
        problems.add(buildProblem(13L, "AI Based Medical Diagnosis Support System", "Software", "Health Tech", "2025-07-30"));
        problems.add(buildProblem(14L, "Drone Based Crop Monitoring", "Hardware", "Agriculture", "2025-07-31"));
        problems.add(buildProblem(15L, "Cyber Attack Detection System", "Software", "Cyber Security", "2025-07-21"));
        problems.add(buildProblem(16L, "AI Based Traffic Signal Optimization", "Software", "Smart Cities", "2025-07-22"));
        problems.add(buildProblem(17L, "Smart Energy Consumption Analyzer", "Hardware", "Energy", "2025-07-23"));
        problems.add(buildProblem(18L, "AI Based Hackathon Product Recommendation System", "Software", "E-Commerce", "2025-07-24"));
        problems.add(buildProblem(19L, "Voice Assistant for Rural Entrepreneurs", "Software", "Artificial Intelligence", "2025-07-25"));
        problems.add(buildProblem(20L, "Smart Pollution Monitoring System", "Hardware", "Environment", "2025-07-26"));
        problems.add(buildProblem(21L, "Digital Inventory System for Hackathons", "Software", "E-Commerce", "2025-07-27"));
        problems.add(buildProblem(22L, "AI Based Fraud Detection System", "Software", "Cyber Security", "2025-07-28"));
        problems.add(buildProblem(23L, "Smart Classroom Attendance System", "Hardware", "Smart Education", "2025-07-29"));
        problems.add(buildProblem(24L, "AI Powered Resume Screening Tool", "Software", "Artificial Intelligence", "2025-07-30"));
        problems.add(buildProblem(25L, "IoT Based Cold Storage Monitoring", "Hardware", "Agriculture", "2025-07-31"));
        problems.add(buildProblem(26L, "Digital Marketplace for Rural Hackathons", "Software", "E-Commerce", "2025-07-22"));
        return problems;
    }

    private ProblemStatement buildProblem(Long id, String title, String category, String theme, String deadline) {
        ProblemStatement problemStatement = new ProblemStatement();
        problemStatement.setProblemId(id);
        problemStatement.setProblemTitle(title);
        problemStatement.setProblemDescription(title + " for Hackathon submissions.");
        problemStatement.setDomain(category);
        problemStatement.setOrganizationName("Hackathon");
        problemStatement.setDifficultyLevel(theme);
        problemStatement.setSubmissionDeadline(Date.valueOf(LocalDate.parse(deadline)));
        problemStatement.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return problemStatement;
    }
}