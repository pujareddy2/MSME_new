package com.sih.backend.controller;

import com.sih.backend.model.*;
import com.sih.backend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ProblemStatementRepository problemRepository;

    // ✅ CREATE APPLICATION (FIXED)
    @PostMapping
    public Application createApplication(@RequestBody Application application) {

        System.out.println("🔥 API HIT");

        // 🔹 STEP 2: CHECK DATA
        System.out.println("Incoming Team ID: " + application.getTeam().getTeamId());
        System.out.println("Incoming Problem ID: " + application.getProblem().getProblemId());

        // 🔹 STEP 3: FETCH REAL OBJECTS FROM DB
        Team team = teamRepository
                .findById(application.getTeam().getTeamId())
                .orElse(null);

        ProblemStatement problem = problemRepository
                .findById(application.getProblem().getProblemId())
                .orElse(null);

        // 🔹 SET INTO APPLICATION
        application.setTeam(team);
        application.setProblem(problem);

        return applicationRepository.save(application);
    }

    // GET ALL
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}