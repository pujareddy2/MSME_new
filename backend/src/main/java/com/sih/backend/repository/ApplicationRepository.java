package com.sih.backend.repository;

import com.sih.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
	boolean existsByTeam_TeamIdAndProblem_ProblemId(Long teamId, Long problemId);

	List<Application> findByTeam_TeamId(Long teamId);
}