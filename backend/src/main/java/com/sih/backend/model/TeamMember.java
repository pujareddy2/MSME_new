package com.sih.backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "team_members")
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "name")
    private String name;

    private String email;

    private String mobile;

    private String gender;

    private String college;

    private String course;

    @Column(name = "roll_number")
    private String rollNumber;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // 🔹 MANY MEMBERS → ONE TEAM
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    // 🔹 OPTIONAL: LINK TO USER (advanced)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 🔹 SELF REFERENCE (mentor system)
    @ManyToOne
    @JoinColumn(name = "mentor_member_id")
    private TeamMember mentor;

    // ---------------- GETTERS & SETTERS ----------------

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TeamMember getMentor() {
        return mentor;
    }

    public void setMentor(TeamMember mentor) {
        this.mentor = mentor;
    }
}