package com.sih.backend.repository;

import com.sih.backend.model.EvaluationScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EvaluationScoreRepository extends JpaRepository<EvaluationScore, Long> {
    List<EvaluationScore> findByEvaluation_EvaluationId(Long evaluationId);
    void deleteByEvaluation_EvaluationId(Long evaluationId);
    
    @Query("SELECT es FROM EvaluationScore es WHERE es.evaluation.application.id = :submissionId ORDER BY es.criteria.criteriaId")
    List<EvaluationScore> findBySubmissionId(@Param("submissionId") Long submissionId);
    
    @Query("SELECT SUM(es.weightedScore) FROM EvaluationScore es WHERE es.evaluation.evaluationId = :evaluationId")
    Double sumWeightedScoresByEvaluation(@Param("evaluationId") Long evaluationId);
}
