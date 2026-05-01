-- Organization Innovation Platform System Schema Update
-- Safe migration-style script
-- Goal: preserve existing data, do not drop/recreate existing tables

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- STEP 1: Ensure required base tables exist where possible
-- =========================================================
CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS default_criteria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  criteria_id INT
);

CREATE TABLE IF NOT EXISTS problem_role_criteria (
  problem_id INT,
  role_id INT,
  criteria_id INT,
  PRIMARY KEY (problem_id, role_id, criteria_id)
);

-- =========================================================
-- STEP 2: Insert default roles and criteria seed data
-- =========================================================
INSERT IGNORE INTO roles (role_name) VALUES
('ADMIN'),
('TEAM_LEAD'),
('TEAM_MEMBER'),
('EVALUATOR'),
('JUDGE'),
('MENTOR');

-- This script supports both possible evaluation_criteria layouts:
--   1) current repo layout: criteria_name, weight_percentage, max_score
--   2) requested simplified layout: name, description
-- We create the simplified columns only if they are missing.
ALTER TABLE evaluation_criteria
  ADD COLUMN IF NOT EXISTS name VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS description TEXT NULL;

-- Map existing name if the repo uses criteria_name
UPDATE evaluation_criteria
SET name = COALESCE(name, criteria_name)
WHERE name IS NULL AND criteria_name IS NOT NULL;

-- Seed default criteria if they are missing
-- Total weight = 100% distributed across 6 criteria (~16.67% each)
INSERT INTO evaluation_criteria (criteria_name, name, description, weight_percentage, max_score)
SELECT 'Abstract', 'Abstract', 'Quality and clarity of the abstract', 16.67, 100
WHERE NOT EXISTS (SELECT 1 FROM evaluation_criteria WHERE criteria_name = 'Abstract' OR name = 'Abstract');

INSERT INTO evaluation_criteria (criteria_name, name, description, weight_percentage, max_score)
SELECT 'Innovation', 'Innovation', 'Originality and uniqueness of the idea', 16.67, 100
WHERE NOT EXISTS (SELECT 1 FROM evaluation_criteria WHERE criteria_name = 'Innovation' OR name = 'Innovation');

INSERT INTO evaluation_criteria (criteria_name, name, description, weight_percentage, max_score)
SELECT 'Tech Stack', 'Tech Stack', 'Appropriate technology choices and architecture', 16.67, 100
WHERE NOT EXISTS (SELECT 1 FROM evaluation_criteria WHERE criteria_name = 'Tech Stack' OR name = 'Tech Stack');

INSERT INTO evaluation_criteria (criteria_name, name, description, weight_percentage, max_score)
SELECT 'Implementation', 'Implementation', 'Feasibility and completeness of implementation plan', 16.67, 100
WHERE NOT EXISTS (SELECT 1 FROM evaluation_criteria WHERE criteria_name = 'Implementation' OR name = 'Implementation');

INSERT INTO evaluation_criteria (criteria_name, name, description, weight_percentage, max_score)
SELECT 'UI/UX Design', 'UI/UX Design', 'User interface quality, user experience, and design aesthetics', 16.67, 100
WHERE NOT EXISTS (SELECT 1 FROM evaluation_criteria WHERE criteria_name = 'UI/UX Design' OR name = 'UI/UX Design');

INSERT INTO evaluation_criteria (criteria_name, name, description, weight_percentage, max_score)
SELECT 'Code Quality', 'Code Quality', 'Code maintainability, documentation, best practices, and performance', 16.67, 100
WHERE NOT EXISTS (SELECT 1 FROM evaluation_criteria WHERE criteria_name = 'Code Quality' OR name = 'Code Quality');

-- =========================================================
-- STEP 3: Primary keys
-- The repository schema already defines primary keys for the existing tables.
-- No destructive or restructuring PK change is applied here.
-- Existing PKs are preserved exactly as they are.
-- =========================================================

-- =========================================================
-- STEP 4: Modify users table
-- Add role_id if missing and connect it to roles
-- Default role is TEAM_MEMBER
-- =========================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role_id INT NULL;

UPDATE users u
LEFT JOIN roles r ON r.role_name = COALESCE(u.role_name, 'TEAM_MEMBER')
SET u.role_id = r.role_id
WHERE u.role_id IS NULL;

ALTER TABLE users
  MODIFY COLUMN role_id INT NOT NULL DEFAULT 3;

ALTER TABLE users
  ADD CONSTRAINT fk_users_role_id
  FOREIGN KEY (role_id) REFERENCES roles(role_id);

-- =========================================================
-- STEP 5: Create default_criteria table relation
-- =========================================================
ALTER TABLE default_criteria
  ADD CONSTRAINT fk_default_criteria_criteria
  FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(criteria_id);

-- =========================================================
-- STEP 6: Create problem_role_criteria relation
-- IMPORTANT:
-- Your repo uses problem_statements.problem_id, not problem_statements.id.
-- This script keeps the relation consistent with the actual repository schema.
-- =========================================================
ALTER TABLE problem_role_criteria
  ADD CONSTRAINT fk_prc_problem
  FOREIGN KEY (problem_id) REFERENCES problem_statements(problem_id);

ALTER TABLE problem_role_criteria
  ADD CONSTRAINT fk_prc_role
  FOREIGN KEY (role_id) REFERENCES roles(role_id);

ALTER TABLE problem_role_criteria
  ADD CONSTRAINT fk_prc_criteria
  FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(criteria_id);

-- =========================================================
-- STEP 7: Modify evaluations table
-- Add evaluator_id and connect to users
-- =========================================================
ALTER TABLE evaluations
  ADD COLUMN IF NOT EXISTS evaluator_id INT NULL;

ALTER TABLE evaluations
  ADD CONSTRAINT fk_evaluations_evaluator
  FOREIGN KEY (evaluator_id) REFERENCES users(user_id);

-- =========================================================
-- STEP 8: Modify evaluation_scores table
-- Ensure required columns and relations exist
-- =========================================================
ALTER TABLE evaluation_scores
  ADD COLUMN IF NOT EXISTS evaluation_id INT NULL,
  ADD COLUMN IF NOT EXISTS criteria_id INT NULL,
  ADD COLUMN IF NOT EXISTS score DECIMAL(10,2) NULL,
  ADD COLUMN IF NOT EXISTS review_text TEXT NULL;

ALTER TABLE evaluation_scores
  ADD CONSTRAINT fk_eval_scores_evaluation
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(evaluation_id);

ALTER TABLE evaluation_scores
  ADD CONSTRAINT fk_eval_scores_criteria
  FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(criteria_id);

-- Keep backward-compatible columns in place if the repo already uses score_value / weighted_score.
-- No drop is performed to preserve existing data.

-- =========================================================
-- STEP 9: Modify judges table
-- Add user_id and connect it to users
-- =========================================================
ALTER TABLE judges
  ADD COLUMN IF NOT EXISTS user_id INT NULL;

ALTER TABLE judges
  ADD CONSTRAINT fk_judges_user
  FOREIGN KEY (user_id) REFERENCES users(user_id);

-- =========================================================
-- STEP 10: Add example seed data to show the relations work
-- These inserts are safe because they use INSERT IGNORE / guarded checks.
-- =========================================================
INSERT IGNORE INTO users (user_id, full_name, email, phone_number, password_hash, role_name, account_status, role_id)
SELECT 1001, 'Team Leader One', 'leader1@example.com', '9999999991', 'demo-hash', 'TEAM_LEAD', 'ACTIVE', role_id
FROM roles WHERE role_name = 'TEAM_LEAD';

INSERT IGNORE INTO users (user_id, full_name, email, phone_number, password_hash, role_name, account_status, role_id)
SELECT 1002, 'Evaluator One', 'evaluator1@example.com', '9999999992', 'demo-hash', 'EVALUATOR', 'ACTIVE', role_id
FROM roles WHERE role_name = 'EVALUATOR';

INSERT IGNORE INTO users (user_id, full_name, email, phone_number, password_hash, role_name, account_status, role_id)
SELECT 1003, 'Judge One', 'judge1@example.com', '9999999993', 'demo-hash', 'JUDGE', 'ACTIVE', role_id
FROM roles WHERE role_name = 'JUDGE';

INSERT IGNORE INTO users (user_id, full_name, email, phone_number, password_hash, role_name, account_status, role_id)
SELECT 1004, 'Team Member One', 'member1@example.com', '9999999994', 'demo-hash', 'TEAM_MEMBER', 'ACTIVE', role_id
FROM roles WHERE role_name = 'TEAM_MEMBER';

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- WHAT THIS SCRIPT DOES
-- 1. Creates roles, default_criteria, and problem_role_criteria if they do not exist.
-- 2. Inserts role master data.
-- 3. Extends users with role_id and links users to roles.
-- 4. Aligns evaluation_criteria with both the repo schema and your requested simplified layout.
-- 5. Adds foreign keys for evaluations, evaluation_scores, and judges.
-- 6. Preserves existing data by avoiding DROP or DELETE.
-- 7. Adds example records so you can verify the relationships.
-- =========================================================

-- =========================================================
-- ADDITIONAL UPDATES: Problem + Notification alignment
-- =========================================================
ALTER TABLE problem_statements
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS theme VARCHAR(120) NULL,
  MODIFY COLUMN problem_description LONGTEXT NULL;

ALTER TABLE problem_statements
  DROP COLUMN IF EXISTS submission_deadline;

ALTER TABLE problem_statements
  DROP COLUMN IF EXISTS team_capacity;

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS type VARCHAR(60) NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE evaluations
  ADD COLUMN IF NOT EXISTS ai_scores LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS ai_remark LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS human_scores LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS human_remark LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS total_score DOUBLE NULL,
  ADD COLUMN IF NOT EXISTS report_payload LONGTEXT NULL;

ALTER TABLE evaluations
  MODIFY COLUMN comments LONGTEXT NULL;
