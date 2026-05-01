-- ================================================
-- JUDGE_REPORTS TABLE CREATION SCRIPT
-- ================================================
-- Run this SQL to create the report storage table

CREATE TABLE IF NOT EXISTS judge_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  problem_id BIGINT NOT NULL,
  team_id INT,
  ai_scores JSON,
  ai_remark LONGTEXT,
  human_scores JSON,
  human_remark LONGTEXT,
  judge_scores JSON,
  judge_remark LONGTEXT,
  final_score DECIMAL(10, 2),
  judge_decision VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES applications(id),
  FOREIGN KEY (problem_id) REFERENCES problem_statements(problem_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id),
  INDEX idx_submission (submission_id),
  INDEX idx_problem (problem_id),
  INDEX idx_judge_decision (judge_decision)
);

-- Add status field to applications table if not exists
ALTER TABLE applications ADD COLUMN IF NOT EXISTS judge_status VARCHAR(50) DEFAULT 'PENDING';

-- Example: Set existing applications that have judge scores to "JUSTIFIED"
UPDATE applications SET judge_status = 'JUSTIFIED' WHERE judge_score IS NOT NULL;
