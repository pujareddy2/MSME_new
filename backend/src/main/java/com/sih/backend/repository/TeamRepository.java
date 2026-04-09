package com.sih.backend.repository;

import com.sih.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
	boolean existsByTeamNameIgnoreCase(String teamName);

	boolean existsByLeader_UserId(Long userId);

	Optional<Team> findByLeader_UserId(Long userId);
}