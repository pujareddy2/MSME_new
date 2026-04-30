package com.sih.backend.config;

import com.sih.backend.model.ProblemStatement;
import com.sih.backend.repository.ProblemStatementRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
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
        problems.add(buildProblem(1L, "AI Based Crop Disease Detection", "Software", "Artificial Intelligence"));
        problems.add(buildProblem(2L, "Smart Irrigation Monitoring System", "Hardware", "Agriculture"));
        problems.add(buildProblem(3L, "AI Based Market Prediction", "Software", "Artificial Intelligence"));
        problems.add(buildProblem(4L, "Blockchain for Supply Chain Transparency", "Software", "Cyber Security"));
        problems.add(buildProblem(5L, "Smart Waste Management using IoT", "Hardware", "Smart Cities"));
        return problems;
    }

    private ProblemStatement buildProblem(Long id, String title, String category, String theme) {
        ProblemStatement problemStatement = new ProblemStatement();
        problemStatement.setProblemId(id);
        problemStatement.setProblemTitle(title);
        problemStatement.setProblemDescription(title + " for platform submissions. This statement supports long-form solutioning with implementation context, beneficiary impact, and measurable outcomes.");
        problemStatement.setDomain(category);
        problemStatement.setTheme(theme);
        problemStatement.setStatus("ACTIVE");
        problemStatement.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return problemStatement;
    }
}
