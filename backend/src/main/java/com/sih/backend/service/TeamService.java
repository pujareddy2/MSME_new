package com.sih.backend.service;

import com.sih.backend.dto.TeamCreateRequest;
import com.sih.backend.dto.TeamMemberRequest;
import com.sih.backend.model.Team;
import com.sih.backend.model.TeamMember;
import com.sih.backend.repository.TeamMemberRepository;
import com.sih.backend.repository.TeamRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    public TeamService(TeamRepository teamRepository, TeamMemberRepository teamMemberRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
    }

    @Transactional
    public Team createTeam(TeamCreateRequest request) {
        if (request.getTeamName() == null || request.getTeamName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team name is required");
        }

        if (teamRepository.existsByTeamNameIgnoreCase(request.getTeamName().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Team name already exists");
        }

        List<TeamMemberRequest> members = request.getMembers() == null ? List.of() : request.getMembers();
        if (members.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one team member is required");
        }

        if (members.size() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum 5 members are allowed");
        }

        Set<String> emails = new LinkedHashSet<>();
        Set<String> rollNumbers = new LinkedHashSet<>();
        for (TeamMemberRequest member : members) {
            if (member.getName() == null || member.getName().trim().isEmpty()
                    || member.getEmail() == null || member.getEmail().trim().isEmpty()
                    || member.getMobile() == null || member.getMobile().trim().isEmpty()
                    || member.getGender() == null || member.getGender().trim().isEmpty()
                    || member.getCollege() == null || member.getCollege().trim().isEmpty()
                    || member.getCourse() == null || member.getCourse().trim().isEmpty()
                    || member.getRollno() == null || member.getRollno().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All team member fields are required");
            }

            String email = normalize(member.getEmail());
            String rollNumber = normalize(member.getRollno());
            if (!emails.add(email) || !rollNumbers.add(rollNumber)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate team member details are not allowed");
            }
        }

        Team team = new Team();
        team.setTeamName(request.getTeamName().trim());
        team.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        Team savedTeam = teamRepository.save(team);
        List<TeamMember> savedMembers = new ArrayList<>();

        for (TeamMemberRequest memberRequest : members) {
            TeamMember teamMember = new TeamMember();
            teamMember.setName(memberRequest.getName());
            teamMember.setEmail(memberRequest.getEmail());
            teamMember.setMobile(memberRequest.getMobile());
            teamMember.setGender(memberRequest.getGender());
            teamMember.setCollege(memberRequest.getCollege());
            teamMember.setCourse(memberRequest.getCourse());
            teamMember.setRollNumber(memberRequest.getRollno());
            teamMember.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            teamMember.setTeam(savedTeam);
            savedMembers.add(teamMemberRepository.save(teamMember));
        }

        savedTeam.setMembers(new LinkedHashSet<>(savedMembers));
        return savedTeam;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}