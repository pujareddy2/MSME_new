package com.sih.backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // 🔹 TEAM LEADER (User)
    @ManyToOne
    @JoinColumn(name = "leader_user_id")
    private User leader;

    // 🔹 LINK TO PROBLEM
    @ManyToOne
    @JoinColumn(name = "problem_id")
    private ProblemStatement problem;

    // 🔹 LINK TO EVENT
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    // ---------------- GETTERS & SETTERS ----------------

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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public User getLeader() {
        return leader;
    }

    public void setLeader(User leader) {
        this.leader = leader;
    }

    public ProblemStatement getProblem() {
        return problem;
    }

    public void setProblem(ProblemStatement problem) {
        this.problem = problem;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}