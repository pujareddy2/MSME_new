package com.sih.backend.repository;

import com.sih.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
	boolean existsByTeam_TeamIdAndProblem_ProblemId(Long teamId, Long problemId);
}