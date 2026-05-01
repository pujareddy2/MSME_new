package com.sih.backend.config;

import com.sih.backend.model.Application;
import com.sih.backend.model.Evaluation;
import com.sih.backend.model.EvaluationCriteria;
import com.sih.backend.model.Judge;
import com.sih.backend.model.Notification;
import com.sih.backend.model.ProblemStatement;
import com.sih.backend.model.Role;
import com.sih.backend.model.Team;
import com.sih.backend.model.TeamMember;
import com.sih.backend.model.User;
import com.sih.backend.repository.ApplicationRepository;
import com.sih.backend.repository.EvaluationCriteriaRepository;
import com.sih.backend.repository.EvaluationRepository;
import com.sih.backend.repository.JudgeRepository;
import com.sih.backend.repository.NotificationRepository;
import com.sih.backend.repository.ProblemStatementRepository;
import com.sih.backend.repository.RoleRepository;
import com.sih.backend.repository.TeamMemberRepository;
import com.sih.backend.repository.TeamRepository;
import com.sih.backend.repository.UserRepository;
import com.sih.backend.util.ProblemIdGenerator;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DataSeeder {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Bean
    CommandLineRunner seedDatabase(
            RoleRepository roleRepository,
            UserRepository userRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            ProblemStatementRepository problemStatementRepository,
            ApplicationRepository applicationRepository,
            EvaluationRepository evaluationRepository,
            EvaluationCriteriaRepository evaluationCriteriaRepository,
            JudgeRepository judgeRepository,
            NotificationRepository notificationRepository) {
        return args -> {
            Role adminRole = ensureRole(roleRepository, "ADMIN", "Platform administrator", 1);
            Role teamLeadRole = ensureRole(roleRepository, "TEAM_LEAD", "Team leader who submits applications", 2);
            Role teamMemberRole = ensureRole(roleRepository, "TEAM_MEMBER", "Member of a team", 3);
            Role evaluatorRole = ensureRole(roleRepository, "EVALUATOR", "Evaluation workspace access", 4);
            Role judgeRole = ensureRole(roleRepository, "JUDGE", "Final judgment workspace access", 5);
            Role mentorRole = ensureRole(roleRepository, "MENTOR", "Mentor workspace access", 6);
            Role eventHeadRole = ensureRole(roleRepository, "EVENT_HEAD", "Event Head workspace access", 7);
            Role collegeSpocRole = ensureRole(roleRepository, "COLLEGE_SPOC", "College SPOC workspace access", 8);

            User admin = ensureUser(userRepository, "Admin User", "admin@platform.local", "9000000006", "8004254595", adminRole, "ADMIN");
            User teamLeader = ensureUser(userRepository, "Lead One", "lead.20260410004026@example.com", "9999999990", "8004254595", teamLeadRole, "TEAM_LEAD");
            User evaluator = ensureUser(userRepository, "Evaluator User", "evaluator@platform.local", "9000000001", "8004254595", evaluatorRole, "EVALUATOR");
            User judge = ensureUser(userRepository, "Judge User", "judge@platform.local", "9000000002", "8004254595", judgeRole, "JUDGE");
            User mentor = ensureUser(userRepository, "Mentor User", "mentor@platform.local", "9000000003", "8004254595", mentorRole, "MENTOR");
            User eventHead = ensureUser(userRepository, "Event Head User", "eventhead@platform.local", "9000000004", "8004254595", eventHeadRole, "EVENT_HEAD");
            User collegeSpoc = ensureUser(userRepository, "College SPOC User", "spoc@platform.local", "9000000005", "8004254595", collegeSpocRole, "COLLEGE_SPOC");
            User teamMember = ensureUser(userRepository, "puja", "middepuja1005@gmail.com", "9121290912", "1234", teamMemberRole, "TEAM_MEMBER");

            ensureCriteriaSeeded(evaluationCriteriaRepository);

            if (problemStatementRepository.count() == 0) {
            ProblemStatement problemOne = createProblem(
                1L,
                "AI Crop Detection",
                "Build an AI-powered crop disease detection system that analyses leaf images, flags early infection signs, and recommends treatment actions for farmers.",
                "Agriculture",
                "Agriculture AI",
                "ACTIVE",
                admin
            );
            ProblemStatement problemTwo = createProblem(
                2L,
                "Smart Waste Management",
                "Create an IoT and data-driven waste collection platform that helps municipalities monitor bin status, route vehicles efficiently, and reduce overflow incidents.",
                "Sustainable Development",
                "Sustainability",
                "ACTIVE",
                admin
            );
            problemStatementRepository.saveAll(List.of(problemOne, problemTwo));
            }

            ProblemStatement problemOne = problemStatementRepository.findById(1L).orElse(null);
            ProblemStatement problemTwo = problemStatementRepository.findById(2L).orElse(null);
            if (problemOne == null || problemTwo == null) {
            return;
            }

            Team team = teamRepository.findByLeader_UserId(teamLeader.getUserId())
                    .orElseGet(() -> {
            Team newTeam = new Team();
            newTeam.setTeamName("AgriGuard Innovators " + System.currentTimeMillis());
            newTeam.setCreatedAt(now());
            newTeam.setLeader(teamLeader);
            newTeam.setProblem(problemOne);
            return teamRepository.save(newTeam);
            });

            if (team.getProblem() == null) {
            team.setProblem(problemOne);
            teamRepository.save(team);
            }

            ensureTeamMember(teamMemberRepository, team, teamMember);

                Application evaluatedApplication = applicationRepository.findByTeam_TeamId(team.getTeamId()).stream()
                .filter(application -> application.getProblem() != null && application.getProblem().getProblemId().equals(problemOne.getProblemId()))
                .findFirst()
                .orElseGet(() -> createApplication(
                        applicationRepository,
                    team,
                    problemOne,
                    "A machine-learning pipeline that classifies leaf disease from captured farm images and provides treatment guidance.",
                    "GitHub repo with image classification code, model checkpoints, and deployment scripts.",
                    "v1.0",
                    "EVALUATED",
                    "https://github.com/organization/agri-detection",
                    "https://example.com/agri-detection.pptx",
                    "https://example.com/agri-detection-demo",
                    84,
                    "AI analysis suggests the concept is relevant and feasible.",
                    88,
                    "Manual review validated the solution depth and deployment plan."
                ));

            applicationRepository.findByTeam_TeamId(team.getTeamId()).stream()
                .filter(application -> application.getProblem() != null && application.getProblem().getProblemId().equals(problemTwo.getProblemId()))
                .findFirst()
                .orElseGet(() -> createApplication(
                        applicationRepository,
                    team,
                    problemTwo,
                    "An IoT-based waste management dashboard that reports bin fill levels and routes pickup trucks to high-priority locations.",
                    "GitHub repo with sensor ingestion, dashboard UI, and route optimization logic.",
                    "v1.0",
                    "SUBMITTED",
                    "https://github.com/organization/waste-management",
                    "https://example.com/waste-management.pptx",
                    "https://example.com/waste-management-demo",
                    null,
                    null,
                    null,
                    null
                ));

            ensureEvaluation(evaluationRepository, evaluatedApplication,
                    Map.of("Innovation", 8.5, "Technical Implementation", 8.0, "Problem Relevance", 9.0, "Use of AI Tools", 8.0, "Feasibility", 8.5, "Scalability", 7.5),
                    "AI review shows a strong fit to the stated problem.",
                    Map.of("Innovation", 8.0, "Technical Implementation", 9.0, "Problem Relevance", 9.0, "Use of AI Tools", 7.5, "Feasibility", 8.5, "Scalability", 8.0),
                    "Human review confirms the solution is practical and well scoped.",
                    86.0,
                    "Evaluation completed and ready for judge review."
            );

            ensureJudge(judgeRepository, applicationRepository, judge, evaluatedApplication, 86.0, "APPROVED", "Meets the evaluation criteria.");

            ensureNotification(notificationRepository, teamLeader, "New Problem Statement Added: " + problemOne.getProblemTitle(), "NEW_PROBLEM_ADDED");
            ensureNotification(notificationRepository, teamLeader, "Submission Made by Team: " + team.getTeamName(), "SUBMISSION_MADE");
            ensureNotification(notificationRepository, teamLeader, "Evaluation Completed for: " + problemOne.getProblemTitle(), "EVALUATION_COMPLETED");
            ensureNotification(notificationRepository, teamLeader, "Application Approved for: " + problemOne.getProblemTitle(), "APPLICATION_APPROVED");
            ensureNotification(notificationRepository, evaluator, "New AI-based insights available for " + problemOne.getProblemTitle(), "AI_INSIGHT");
        };
    }

    private Role ensureRole(RoleRepository roleRepository, String roleName, String description, Integer level) {
        return roleRepository.findByRoleNameIgnoreCase(roleName).orElseGet(() -> {
            Role role = new Role();
            role.setRoleName(roleName);
            role.setRoleDescription(description);
            role.setRoleLevel(level);
            return roleRepository.save(role);
        });
    }

    private User ensureUser(UserRepository userRepository, String fullName, String email, String mobile, String password, Role role, String roleName) {
        return userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPhoneNumber(mobile);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRole(role);
            user.setRoleName(roleName);
            user.setAccountStatus("ACTIVE");
            user.setCreatedAt(now());
            return userRepository.save(user);
        });
    }

    private void ensureCriteriaSeeded(EvaluationCriteriaRepository evaluationCriteriaRepository) {
        if (evaluationCriteriaRepository.count() > 0) {
            return;
        }

        evaluationCriteriaRepository.saveAll(List.of(
                createCriterion("Innovation", 16.67, 10.0),
                createCriterion("Technical Implementation", 16.67, 10.0),
                createCriterion("Problem Relevance", 16.67, 10.0),
                createCriterion("Use of AI Tools", 16.67, 10.0),
                createCriterion("Feasibility", 16.66, 10.0),
                createCriterion("Scalability", 16.66, 10.0)
        ));
    }

    private EvaluationCriteria createCriterion(String name, Double weight, Double maxScore) {
        EvaluationCriteria criteria = new EvaluationCriteria();
        criteria.setCriteriaName(name);
        criteria.setWeightPercentage(weight);
        criteria.setMaxScore(maxScore);
        return criteria;
    }

    private ProblemStatement createProblem(Long id, String title, String description, String domain, String theme, String status, User createdBy) {
        ProblemStatement problem = new ProblemStatement();
        problem.setProblemId(id);
        problem.setCustomProblemId(ProblemIdGenerator.generateProblemId(Math.toIntExact(id)));  // Convert to NV format
        problem.setProblemTitle(title);
        problem.setProblemDescription(description);
        problem.setDomain(domain);
        problem.setTheme(theme);
        problem.setStatus(status);
        problem.setCreatedAt(now());
        problem.setCreatedBy(createdBy);
        return problem;
    }

    private Application createApplication(ApplicationRepository applicationRepository, Team team, ProblemStatement problem, String abstractText, String technologyStack, String version, String status, String githubLink, String pptLink, String demoLink, Integer aiScore, String aiRemarks, Integer manualScore, String manualRemarks) {
        Application application = new Application();
        application.setTeam(team);
        application.setProblem(problem);
        application.setAbstractText(abstractText);
        application.setTechnologyStack(technologyStack);
        application.setSubmissionVersion(version);
        application.setSubmissionStatus(status);
        application.setGithubLink(githubLink);
        application.setPptFileName(pptLink);
        application.setPptFilePath(pptLink);
        application.setDemoLink(demoLink);
        application.setAiScore(aiScore);
        application.setAiRemarks(aiRemarks);
        application.setManualScore(manualScore);
        application.setManualRemarks(manualRemarks);
        application.setEvaluatedAt(status == null || status.equalsIgnoreCase("SUBMITTED") ? null : now());
        return applicationRepository.save(application);
    }

    private void ensureTeamMember(TeamMemberRepository teamMemberRepository, Team team, User user) {
        if (teamMemberRepository.existsByEmailIgnoreCase(user.getEmail())) {
            return;
        }

        TeamMember member = new TeamMember();
        member.setName(user.getFullName());
        member.setEmail(user.getEmail());
        member.setMobile(user.getPhoneNumber());
        member.setInvitationStatus("ACCEPTED");
        member.setInvitedBy(team.getLeader() != null ? team.getLeader().getUserId() : null);
        member.setCollege("Organization Innovation College");
        member.setCourse("B.Tech CSE");
        member.setRollNumber("ROLL-001");
        member.setCreatedAt(now());
        member.setTeam(team);
        member.setUser(user);
        teamMemberRepository.save(member);
    }

    private void ensureEvaluation(EvaluationRepository evaluationRepository, Application application, Map<String, Double> aiScores, String aiRemark, Map<String, Double> humanScores, String humanRemark, Double totalScore, String comments) {
        if (evaluationRepository.findByApplication_Id(application.getId()).isPresent()) {
            return;
        }

        Evaluation evaluation = new Evaluation();
        evaluation.setApplication(application);
        evaluation.setEvaluationStatus("COMPLETED");
        evaluation.setAiScoresJson(toJson(aiScores));
        evaluation.setAiRemark(aiRemark);
        evaluation.setHumanScoresJson(toJson(humanScores));
        evaluation.setHumanRemark(humanRemark);
        evaluation.setTotalScore(totalScore);
        evaluation.setComments(comments);
        evaluation.setCreatedAt(now());
        evaluationRepository.save(evaluation);
    }

    private void ensureJudge(JudgeRepository judgeRepository, ApplicationRepository applicationRepository, User judgeUser, Application application, Double score, String decision, String remarks) {
        if (judgeRepository.findByUser_UserId(judgeUser.getUserId()).isPresent()) {
            return;
        }

        Judge judge = new Judge();
        judge.setUser(judgeUser);
        judge.setApplication(application);
        judge.setFinalScore(score);
        judge.setFinalDecision(decision);
        judge.setRemarks(remarks);
        judge.setJudgedAt(now());
        judgeRepository.save(judge);

        application.setJudgedBy(judgeUser.getFullName());
        application.setJudgeScore(score == null ? null : score.intValue());
        application.setManualRemarks(remarks);
        application.setSubmissionStatus("JUDGED");
        application.setEvaluatedAt(now());
        applicationRepository.save(application);
    }

    private void ensureNotification(NotificationRepository repository, User user, String message, String type) {
        boolean alreadyExists = repository.findByUser_UserIdOrderByTimestampDesc(user.getUserId()).stream()
                .anyMatch(notification -> message.equals(notification.getMessage()) && type.equalsIgnoreCase(notification.getType()));
        if (alreadyExists) {
            return;
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(Boolean.FALSE);
        notification.setTimestamp(now());
        repository.save(notification);
    }

    private String toJson(Map<String, Double> values) {
        StringBuilder builder = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Double> entry : new LinkedHashMap<>(values).entrySet()) {
            if (!first) {
                builder.append(",");
            }
            builder.append('"').append(entry.getKey()).append('"').append(":").append(entry.getValue());
            first = false;
        }
        builder.append("}");
        return builder.toString();
    }

    private Timestamp now() {
        return new Timestamp(System.currentTimeMillis());
    }
}