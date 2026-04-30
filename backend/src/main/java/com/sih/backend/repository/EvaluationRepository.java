package com.sih.backend.repository;

import com.sih.backend.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByApplication_Id(Long applicationId);
    
    List<Evaluation> findByApplication_Problem_ProblemId(Long problemId);
    
    @Query("SELECT COUNT(e) FROM Evaluation e WHERE e.application.problem.problemId = :problemId AND e.evaluationStatus = 'COMPLETED'")
    long countCompletedEvaluationsByProblem(@Param("problemId") Long problemId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.application.id = :submissionId")
    Optional<Evaluation> findBySubmissionId(@Param("submissionId") Long submissionId);
}
