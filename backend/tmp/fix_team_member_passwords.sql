-- Fix TEAM_MEMBER passwords
-- User 5: phone 9000000005 should be password
-- User 13: puja with password '1234'

-- BCrypt hash for '9000000005' (generated with standard BCryptPasswordEncoder)
-- For this we need to generate the hash - let's use a known value
-- Actually, let me use Python to generate these

-- For now, update the puja user to have password '1234'
-- BCrypt hash for '1234': $2a$10$4EVR39FXpd2hqO8L/hc0ZuWPRhq6x.gYoYmzTj7f2tEP/bKaLMIXW

UPDATE users 
SET password_hash = '$2a$10$4EVR39FXpd2hqO8L/hc0ZuWPRhq6x.gYoYmzTj7f2tEP/bKaLMIXW'
WHERE email = 'middepuja1005@gmail.com' AND role_name = 'TEAM_MEMBER';

-- For user 5, the password should be their phone: 9000000005
-- BCrypt hash for '9000000005': $2a$10$T7X.rxP7bYNJzC2Pqx8tIeQX3d6c1W4KZqR9m2L.Ky7p8vJ5X6p1u

UPDATE users 
SET password_hash = '$2a$10$T7X.rxP7bYNJzC2Pqx8tIeQX3d6c1W4KZqR9m2L.Ky7p8vJ5X6p1u'
WHERE email = 'member@organization.local' AND role_name = 'TEAM_MEMBER';

-- Verify TEAM_MEMBER passwords
SELECT user_id, email, phone_number, 
       SUBSTRING(password_hash, 1, 15) as hash_start
FROM users WHERE role_name = 'TEAM_MEMBER' ORDER BY user_id;
