-- Seed additional judged reports for demo/testing
-- Idempotent: only updates rows that are not judged yet.

-- Ensure judging columns exist (safe no-op if already present)
SET @has_ai_score := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'ai_score'
);
SET @sql := IF(@has_ai_score = 0, 'ALTER TABLE applications ADD COLUMN ai_score INT NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_ai_remarks := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'ai_remarks'
);
SET @sql := IF(@has_ai_remarks = 0, 'ALTER TABLE applications ADD COLUMN ai_remarks TEXT NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_manual_score := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'manual_score'
);
SET @sql := IF(@has_manual_score = 0, 'ALTER TABLE applications ADD COLUMN manual_score INT NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_manual_remarks := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'manual_remarks'
);
SET @sql := IF(@has_manual_remarks = 0, 'ALTER TABLE applications ADD COLUMN manual_remarks TEXT NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_evaluated_at := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'evaluated_at'
);
SET @sql := IF(@has_evaluated_at = 0, 'ALTER TABLE applications ADD COLUMN evaluated_at TIMESTAMP NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- App 2
UPDATE applications
SET submission_status = 'Judged',
    ai_score = 74,
    ai_remarks = 'AI judging indicates good alignment with the selected platform problem and a practical baseline architecture.',
    manual_score = 79,
    manual_remarks = 'Manual review confirms clear implementation path with acceptable delivery risk and good problem fit.',
    evaluated_at = COALESCE(evaluated_at, NOW())
WHERE id = 2 AND manual_score IS NULL;

-- App 3
UPDATE applications
SET submission_status = 'Judged',
    ai_score = 81,
    ai_remarks = 'AI judging highlights strong feasibility and measurable value for platform process optimization.',
    manual_score = 84,
    manual_remarks = 'Manual remarks: solution has strong clarity, realistic milestones, and strong scalability potential.',
    evaluated_at = COALESCE(evaluated_at, NOW())
WHERE id = 3 AND manual_score IS NULL;

-- App 4
UPDATE applications
SET submission_status = 'Judged',
    ai_score = 69,
    ai_remarks = 'AI score reflects moderate feasibility due to dependency assumptions, but core concept remains useful.',
    manual_score = 73,
    manual_remarks = 'Manual review: concept is valid, but needs tighter scope definition and better validation metrics.',
    evaluated_at = COALESCE(evaluated_at, NOW())
WHERE id = 4 AND manual_score IS NULL;

-- App 5
UPDATE applications
SET submission_status = 'Judged',
    ai_score = 86,
    ai_remarks = 'AI score is high due to clear articulation, strong impact potential, and implementable architecture choices.',
    manual_score = 88,
    manual_remarks = 'Manual feedback: excellent proposal quality with clear impact path and convincing technical execution plan.',
    evaluated_at = COALESCE(evaluated_at, NOW())
WHERE id = 5 AND manual_score IS NULL;

-- Notify team leaders for updated reports (idempotent by message)
INSERT INTO notifications (user_id, message, is_read, created_at)
SELECT t.leader_user_id,
      CONCAT('Judging report published for application #', a.id, '.'),
       0,
       NOW()
FROM applications a
JOIN teams t ON t.team_id = a.team_id
WHERE a.id IN (2,3,4,5)
  AND t.leader_user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM notifications n
    WHERE n.user_id = t.leader_user_id
        AND n.message = CONCAT('Judging report published for application #', a.id, '.')
  );
