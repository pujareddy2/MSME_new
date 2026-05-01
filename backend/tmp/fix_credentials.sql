-- Fix user credentials to match LOGIN_DETAILS.md
-- Password for all non-team roles: 8004254595
-- BCrypt hash: $2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2

-- Update platform role users with correct password hash
UPDATE users 
SET password_hash = '$2a$10$sS5bdNRODIjAPWkEj.wIo.y5OrY1naLnICneSq1sTBEAEqv6ho/g2'
WHERE role_name IN ('EVALUATOR', 'JUDGE', 'MENTOR', 'ADMIN', 'EVENT_HEAD', 'COLLEGE_SPOC') 
AND email LIKE '%platform%';

-- Update TEAM_MEMBER passwords to hash of their phone number (already correct if created via TeamService)
-- But let's verify the puja user has correct password
UPDATE users 
SET password_hash = '$2a$10$sHxDQFJxHz9OBA3bD5mQ0e/7NtdT8v/W/FsEOuFvu2HzstVcO0d4u'
WHERE email = 'middepuja1005@gmail.com' AND role_name = 'TEAM_MEMBER';

-- Verify updates
SELECT user_id, full_name, email, phone_number, role_name, 
       SUBSTRING(password_hash, 1, 20) as hash_start,
       LENGTH(password_hash) as hash_length
FROM users 
WHERE role_name IN ('EVALUATOR', 'JUDGE', 'MENTOR', 'ADMIN', 'EVENT_HEAD', 'COLLEGE_SPOC', 'TEAM_MEMBER')
ORDER BY role_name, user_id;
