package com.sih.backend.repository;

import com.sih.backend.model.EvaluationCriteria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationCriteriaRepository extends JpaRepository<EvaluationCriteria, Long> {
    EvaluationCriteria findByCriteriaName(String criteriaName);
    
    List<EvaluationCriteria> findAllByOrderByCriteriaId();
}
