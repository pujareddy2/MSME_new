package com.sih.backend.repository;

import com.sih.backend.model.JudgeReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JudgeReportRepository extends JpaRepository<JudgeReport, Long> {
    Optional<JudgeReport> findBySubmission_Id(Long submissionId);
    List<JudgeReport> findAllByOrderByJustificationDateDesc();
}
