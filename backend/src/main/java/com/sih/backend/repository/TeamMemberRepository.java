package com.sih.backend.repository;

import com.sih.backend.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
	boolean existsByTeam_TeamIdAndEmailIgnoreCase(Long teamId, String email);

	boolean existsByTeam_TeamIdAndRollNumberIgnoreCase(Long teamId, String rollNumber);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByMobileIgnoreCase(String mobile);

	Optional<TeamMember> findByEmailIgnoreCase(String email);
}