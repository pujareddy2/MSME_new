-- Seed one default login user for each non-team role.
-- This script is idempotent by email (safe to run multiple times).
-- Password for all seeded users is: 8004254595
-- BCrypt hash below corresponds to plaintext password: 8004254595

INSERT INTO users (full_name, email, phone_number, password_hash, role_name, account_status, created_at)
SELECT 'Evaluator User', 'evaluator@hackathon.local', '9000000001', '$2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2', 'EVALUATOR', 'ACTIVE', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='evaluator@hackathon.local');

INSERT INTO users (full_name, email, phone_number, password_hash, role_name, account_status, created_at)
SELECT 'Judge User', 'judge@hackathon.local', '9000000002', '$2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2', 'JUDGE', 'ACTIVE', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='judge@hackathon.local');

INSERT INTO users (full_name, email, phone_number, password_hash, role_name, account_status, created_at)
SELECT 'Mentor User', 'mentor@hackathon.local', '9000000003', '$2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2', 'MENTOR', 'ACTIVE', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='mentor@hackathon.local');

INSERT INTO users (full_name, email, phone_number, password_hash, role_name, account_status, created_at)
SELECT 'Event Head User', 'eventhead@hackathon.local', '9000000004', '$2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2', 'EVENT_HEAD', 'ACTIVE', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='eventhead@hackathon.local');

INSERT INTO users (full_name, email, phone_number, password_hash, role_name, account_status, created_at)
SELECT 'College SPOC User', 'spoc@hackathon.local', '9000000005', '$2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2', 'COLLEGE_SPOC', 'ACTIVE', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='spoc@hackathon.local');

INSERT INTO users (full_name, email, phone_number, password_hash, role_name, account_status, created_at)
SELECT 'Admin User', 'admin@hackathon.local', '9000000006', '$2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2', 'ADMIN', 'ACTIVE', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='admin@hackathon.local');
