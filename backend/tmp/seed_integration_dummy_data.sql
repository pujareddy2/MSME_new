-- Integration dummy data seed for Hackathon portal
-- Safe/idempotent script for judge/report/activity integration checks.
-- Run with:
-- "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -ppuja -D hackathon_portal < backend\tmp\seed_integration_dummy_data.sql

-- 1) Ensure judging columns exist for judge/report flow (version-safe).
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

-- 2) Mark one submitted application as judged with dummy AI/manual values.
SET @target_application_id := (
  SELECT id FROM applications
  WHERE manual_score IS NULL
  ORDER BY id ASC
  LIMIT 1
);

UPDATE applications
SET ai_score = COALESCE(ai_score, 78),
    ai_remarks = COALESCE(ai_remarks, 'AI suggests the solution is feasible with moderate implementation complexity and strong Hackathon impact.'),
    manual_score = COALESCE(manual_score, 82),
    manual_remarks = COALESCE(manual_remarks, 'Manual review confirms clear problem understanding, practical stack choice, and a deployable scope.'),
    evaluated_at = COALESCE(evaluated_at, NOW()),
    submission_status = 'Judged'
WHERE id = @target_application_id;

-- 3) Add dashboard activity/notification dummy entries for team leads.
INSERT INTO notifications (user_id, message, is_read, created_at)
SELECT u.user_id,
       'Dummy activity: Team profile updated by Team Lead.',
       0,
       NOW()
FROM users u
WHERE u.role_name = 'TEAM_LEAD'
  AND NOT EXISTS (
      SELECT 1
      FROM notifications n
      WHERE n.user_id = u.user_id
        AND n.message = 'Dummy activity: Team profile updated by Team Lead.'
  );

INSERT INTO notifications (user_id, message, is_read, created_at)
SELECT u.user_id,
       'Dummy activity: Member removed from team due to duplicate registration.',
       0,
       NOW()
FROM users u
WHERE u.role_name = 'TEAM_LEAD'
  AND NOT EXISTS (
      SELECT 1
      FROM notifications n
      WHERE n.user_id = u.user_id
        AND n.message = 'Dummy activity: Member removed from team due to duplicate registration.'
  );

INSERT INTO notifications (user_id, message, is_read, created_at)
SELECT u.user_id,
       'Dummy activity: Problem statement selected for evaluation round.',
       0,
       NOW()
FROM users u
WHERE u.role_name = 'TEAM_LEAD'
  AND NOT EXISTS (
      SELECT 1
      FROM notifications n
      WHERE n.user_id = u.user_id
        AND n.message = 'Dummy activity: Problem statement selected for evaluation round.'
  );

-- 4) Add one judge-side sample notification if available.
INSERT INTO notifications (user_id, message, is_read, created_at)
SELECT u.user_id,
      'Dummy activity: Judging report generated successfully.',
       0,
       NOW()
FROM users u
WHERE u.role_name IN ('EVALUATOR', 'JUDGE')
  AND NOT EXISTS (
      SELECT 1
      FROM notifications n
      WHERE n.user_id = u.user_id
        AND n.message = 'Dummy activity: Judging report generated successfully.'
  )
LIMIT 1;
