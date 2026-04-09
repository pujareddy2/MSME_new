package com.sih.backend.dto;

import java.util.List;

public class TeamCreateRequest {
    private String teamName;
    private List<TeamMemberRequest> members;

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<TeamMemberRequest> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMemberRequest> members) {
        this.members = members;
    }
}