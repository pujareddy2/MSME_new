package com.sih.backend.service;

import com.sih.backend.dto.TeamCreateRequest;
import com.sih.backend.dto.TeamMemberRequest;
import com.sih.backend.model.Team;
import com.sih.backend.model.TeamMember;
import com.sih.backend.model.User;
import com.sih.backend.repository.TeamMemberRepository;
import com.sih.backend.repository.TeamRepository;
import com.sih.backend.repository.UserRepository;
import com.sih.backend.service.NotificationService;

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
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TeamService(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
    }

    public Team getTeamByLeaderId(Long leaderId) {
        return teamRepository.findByLeader_UserId(leaderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found for leader"));
    }

    @Transactional
    public Team createTeam(TeamCreateRequest request) {
        if (request.getLeaderId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Leader ID is required");
        }

        if (request.getTeamName() == null || request.getTeamName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team name is required");
        }

        if (teamRepository.existsByTeamNameIgnoreCase(request.getTeamName().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Team name already exists");
        }

        User leader = userRepository.findById(request.getLeaderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team leader not found"));

        if (leader.getRoleName() == null || !leader.getRoleName().equalsIgnoreCase("TEAM_LEAD")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only team leaders can create teams");
        }

        if (teamRepository.existsByLeader_UserId(leader.getUserId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "One team leader can create only one team");
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
                    || member.getGender() == null || member.getGender().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, email, mobile and gender are required for each team member");
            }

            String email = normalize(member.getEmail());
            String rollNumber = normalize(member.getRollno());
            if (!emails.add(email) || (!rollNumber.isEmpty() && !rollNumbers.add(rollNumber))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate team member details are not allowed");
            }
        }

        Team team = new Team();
        team.setTeamName(request.getTeamName().trim());
        team.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        team.setLeader(leader);

        Team savedTeam = teamRepository.save(team);
        List<TeamMember> savedMembers = new ArrayList<>();

        for (TeamMemberRequest memberRequest : members) {
            if (teamMemberRepository.existsByEmailIgnoreCase(memberRequest.getEmail().trim())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This participant is already registered in another team.");
            }

            if (teamMemberRepository.existsByMobileIgnoreCase(memberRequest.getMobile().trim())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This phone number is already registered in another team.");
            }

            User memberUser = new User();
            memberUser.setFullName(memberRequest.getName().trim());
            memberUser.setEmail(memberRequest.getEmail().trim().toLowerCase(Locale.ROOT));
            memberUser.setPhoneNumber(memberRequest.getMobile().trim());
            memberUser.setRoleName("TEAM_MEMBER");
            memberUser.setAccountStatus("INVITED");
            memberUser.setTeam(savedTeam);
            memberUser.setPasswordHash(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(memberRequest.getMobile().trim()));
            memberUser.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            userRepository.save(memberUser);

            TeamMember teamMember = new TeamMember();
            teamMember.setName(memberRequest.getName());
            teamMember.setEmail(memberRequest.getEmail());
            teamMember.setMobile(memberRequest.getMobile());
            teamMember.setGender(memberRequest.getGender());
            teamMember.setCollege(memberRequest.getCollege() == null ? null : memberRequest.getCollege().trim());
            teamMember.setCourse(memberRequest.getCourse() == null ? null : memberRequest.getCourse().trim());
            teamMember.setRollNumber(memberRequest.getRollno() == null ? null : memberRequest.getRollno().trim());
            teamMember.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            teamMember.setTeam(savedTeam);
            teamMember.setInvitationStatus("INVITED");
            teamMember.setInvitedBy(leader.getUserId());
            teamMember.setUser(memberUser);
            savedMembers.add(teamMemberRepository.save(teamMember));

            notificationService.createNotification(memberUser.getUserId(),
                    "You have been added to team " + savedTeam.getTeamName() + " by Team Leader " + leader.getFullName() + ".");

                notificationService.createNotification(leader.getUserId(),
                    "Member added: " + memberRequest.getName().trim() + " (" + memberRequest.getEmail().trim().toLowerCase(Locale.ROOT) + ") to team " + savedTeam.getTeamName() + ".");
        }

        savedTeam.getMembers().clear();
        savedTeam.getMembers().addAll(savedMembers);
        notificationService.createNotification(leader.getUserId(),
            "Team created successfully: " + savedTeam.getTeamName() + ". Invitations have been sent to team members.");
        return savedTeam;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}