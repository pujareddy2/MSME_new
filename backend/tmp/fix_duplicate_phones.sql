-- Fix duplicate phone numbers
-- Platform users should keep their documented numbers (9000000001-9000000006)
-- Organization.local users need unique phone numbers (9999999000-9999999010)

UPDATE users SET phone_number = '9999999001' WHERE email = 'admin@organization.local' AND role_name = 'ADMIN';
UPDATE users SET phone_number = '9999999002' WHERE email = 'leader@organization.local' AND role_name = 'TEAM_LEAD';
UPDATE users SET phone_number = '9999999003' WHERE email = 'evaluator@organization.local' AND role_name = 'EVALUATOR';
UPDATE users SET phone_number = '9999999004' WHERE email = 'judge@organization.local' AND role_name = 'JUDGE';
UPDATE users SET phone_number = '9999999005' WHERE email = 'member@organization.local' AND role_name = 'TEAM_MEMBER';

-- Verify the fix
SELECT phone_number, COUNT(*) as count FROM users GROUP BY phone_number HAVING count > 1;

-- Show updated users
SELECT user_id, email, phone_number, role_name FROM users WHERE email LIKE '%organization.local%' OR email LIKE '%platform.local%' ORDER BY role_name, email;
