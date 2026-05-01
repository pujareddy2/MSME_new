# Login Details Reference

This file is a single place to check login accounts currently stored in database.

Last verified from DB (for listed accounts): 2026-05-01
Database: Organization_portal

**STATUS: ✅ All credentials synchronized - Email and phone-based login working**

## SUMMARY OF CHANGES (2026-05-01)

### Changes Made to Database:
1. **Password Synchronization**: All platform role users (EVALUATOR, JUDGE, MENTOR, EVENT_HEAD, COLLEGE_SPOC, ADMIN) now have password `8004254595` with matching BCrypt hash
2. **Duplicate Phone Numbers Fixed**: Resolved conflict where multiple users shared same phone numbers:
   - organization.local users: Assigned unique numbers (9999999001-9999999005)
   - platform.local users: Kept documented numbers (9000000001-9000000006)
3. **Database Records Updated**: User IDs and phone numbers now accurately reflect database state
4. **Authentication Verified**: Both email and phone-based login tested and confirmed working

### Result:
✅ Email login works: `evaluator@platform.local` + password `8004254595`
✅ Phone login works: `9000000001` + password `8004254595`
✅ All role-based routing functional
✅ Database credentials synchronized with code

## 1. Login Form Inputs
Use these values in login page:
- Email/Phone
- Password
- Role

Frontend source: frontend/src/pages/Login.jsx

## 2. Role-Wise Accounts Present In DB

 TEAM_LEAD (listed: 1)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 2 | Team Leader One | leader@organization.local | 9999999002 | ACTIVE | Not readable from DB (bcrypt hash only) |

Login usage:
- Email/Phone: one of above email or phone values
- Role: TEAM_LEAD
- Password: use the original password used at registration

### TEAM_MEMBER (listed: 2)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 5 | Team Member One | member@organization.local | 9999999005 | ACTIVE | 9999999005 |
| 13 | puja | middepuja1005@gmail.com | 9121290912 | ACTIVE | 1234 |

Login usage:
- Email/Phone: member email or member phone
- Role: TEAM_MEMBER
- Password: member mobile number (or `1234` for middepuja1005@gmail.com)

### EVALUATOR (present: 1)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 8 | Evaluator User | evaluator@platform.local | 9000000001 | ACTIVE | 8004254595 |

Login usage:
- Email/Phone: evaluator@platform.local or 9000000001
- Role: EVALUATOR
- Password: 8004254595

### JUDGE (present: 1)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 9 | Judge User | judge@platform.local | 9000000002 | ACTIVE | 8004254595 |

Login usage:
- Email/Phone: judge@platform.local or 9000000002
- Role: JUDGE
- Password: 8004254595

### MENTOR (present: 1)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 10 | Mentor User | mentor@platform.local | 9000000003 | ACTIVE | 8004254595 |

Login usage:
- Email/Phone: mentor@platform.local or 9000000003
- Role: MENTOR
- Password: 8004254595

### EVENT_HEAD (present: 1)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 11 | Event Head User | eventhead@platform.local | 9000000004 | ACTIVE | 8004254595 |

Login usage:
- Email/Phone: eventhead@platform.local or 9000000004
- Role: EVENT_HEAD
- Password: 8004254595

### COLLEGE_SPOC (present: 1)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 12 | College SPOC User | spoc@platform.local | 9000000005 | ACTIVE | 8004254595 |

Login usage:
- Email/Phone: spoc@platform.local or 9000000005
- Role: COLLEGE_SPOC
- Password: 8004254595

### ADMIN (present: 1)
Stored users:

| user_id | name | email | phone | status | password |
|---|---|---|---|---|---|
| 6 | Admin User | admin@platform.local | 9000000006 | ACTIVE | 8004254595 |

Login usage:
- Email/Phone: admin@platform.local or 9000000006
- Role: ADMIN
- Password: 8004254595

## 3. Why Some Roles Cannot Login Now
Dropdown contains many roles, but backend currently auto-creates only:
- TEAM_LEAD (registration flow)
- TEAM_MEMBER (team creation flow)

Now evaluator/judge/mentor/admin/event_head/college_spoc users have been inserted in DB.
If a role login fails, verify the selected role exactly matches role_name in users table.

Backend sources:
- backend/src/main/java/com/sih/backend/service/AuthService.java
- backend/src/main/java/com/sih/backend/service/TeamService.java

Seed script file:
- backend/tmp/seed_role_logins.sql

## 4. DB Verification Commands
List all users:

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -ppuja -D Organization_portal -e "SELECT user_id, full_name, email, phone_number, role_name, account_status FROM users ORDER BY role_name, user_id;"

Count by role:

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -ppuja -D Organization_portal -e "SELECT role_name, COUNT(*) AS user_count FROM users GROUP BY role_name ORDER BY role_name;"
