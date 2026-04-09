package com.sih.backend.repository;

import com.sih.backend.model.ProblemStatement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemStatementRepository extends JpaRepository<ProblemStatement, Long> {}