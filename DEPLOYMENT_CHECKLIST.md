# Deployment Checklist - MSME Evaluation System

## Phase 1: Pre-Deployment Setup ⏳

### Database Setup
- [ ] Backup existing MySQL database
- [ ] Review `mysql_hackathon_schema_update.sql` script (schema for MSME Innovation Platform)
- [ ] Execute SQL migration in MySQL Workbench
- [ ] Verify schema changes:
  ```sql
  -- Check roles table
  SELECT * FROM roles;  -- Should show 6 roles
  
  -- Check evaluation_criteria
  SELECT * FROM evaluation_criteria;  -- Should show 6 criteria with 16.67% weight
  
  -- Check users has role_id
  DESC users;  -- role_id should be INT NOT NULL DEFAULT 3
  
  -- Check evaluations has evaluator_id
  DESC evaluations;  -- evaluator_id should be INT
  ```
- [ ] Verify all foreign key constraints created
- [ ] Verify no existing data lost

### Code Compilation
- [ ] Clone/pull latest code
- [ ] Verify Java 17 installed: `java -version`
- [ ] Verify Maven installed: `mvn -version`
- [ ] Navigate to backend: `cd backend`
- [ ] Clean previous builds: `mvn clean`
- [ ] Compile code: `mvn compile`
- [ ] Check for compilation errors
- [ ] Build JAR: `mvn package`
- [ ] Verify JAR created: `ls target/*.jar`

### Environment Configuration
- [ ] Verify `application.properties` has correct database URL
- [ ] Check database username/password
- [ ] Verify port 8080 is available (or adjust)
- [ ] Check file system permissions for logs directory

---

## Phase 2: Backend Deployment ✈️

### Start Spring Boot Application
- [ ] Start application: `mvn spring-boot:run` OR `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- [ ] Wait for startup complete (look for: "Tomcat started on port 8080")
- [ ] Check application logs for errors
- [ ] Verify no exceptions in startup logs

### Backend Health Check
- [ ] Access health endpoint: `http://localhost:8080/actuator/health`
  - Expected: `{"status":"UP"}`
- [ ] Check all context paths loaded
- [ ] Verify database connection
- [ ] Verify REST controllers registered

---

## Phase 3: API Verification 🔍

### Endpoint Test Sequence

#### 1. Evaluation Criteria Endpoint
```bash
curl http://localhost:8080/api/evaluation-criteria
```
- [ ] Returns HTTP 200
- [ ] Response has 6 criteria
- [ ] Each criteria has: criteriaId, criteriaName, description, weightPercentage, maxScore
- [ ] All weights are 16.67%

#### 2. Submission Count Endpoint
```bash
curl http://localhost:8080/api/evaluations/problems/1/solutions/count
```
- [ ] Returns HTTP 200 or 404 (if no problem 1)
- [ ] Response format: `{problemId, submissionCount}`

#### 3. Evaluation Submission Endpoint (Core)
```bash
curl -X POST http://localhost:8080/api/evaluations \
  -H "Content-Type: application/json" \
  -d '{submissionId, evaluatorId, overallReview, criteriaScores}'
```
- [ ] Returns HTTP 200
- [ ] Response has success=true
- [ ] Response includes SubmissionDetailsResponse
- [ ] totalScore is calculated correctly
- [ ] normalizedScore is 0-100 range

#### 4. Evaluation Details Endpoint
```bash
curl http://localhost:8080/api/evaluations/1
```
- [ ] Returns HTTP 200 or 404
- [ ] Response includes all evaluation data

#### 5. Submission Details Endpoint
```bash
curl http://localhost:8080/api/submissions/1/details
```
- [ ] Returns HTTP 200 or 404
- [ ] Response includes evaluation and criteria scores

#### 6. Evaluation Summary Endpoint
```bash
curl http://localhost:8080/api/evaluations/problems/1/evaluation-summary
```
- [ ] Returns HTTP 200 or 404
- [ ] Response includes problemId, submissionCount, evaluationCount, results array

#### 7. Judge Dashboard Endpoint
```bash
curl http://localhost:8080/api/judge/dashboard
```
- [ ] Returns HTTP 200
- [ ] Response includes count and data array
- [ ] Only shows EVALUATED submissions

#### 8. Judge Finalize Endpoint (Critical Test)
```bash
curl -X POST http://localhost:8080/api/judge/finalize \
  -H "Content-Type: application/json" \
  -d '{submissionId, judgeUserId, finalDecision, finalScore, remarks}'
```
- [ ] Returns HTTP 200
- [ ] Response has success=true
- [ ] Judge data populated in response
- [ ] Application status updated to JUDGED

#### 9. Judge Finalize Validation (Test Negative Case)
```bash
# Try judging SUBMITTED (not EVALUATED) submission
curl -X POST http://localhost:8080/api/judge/finalize \
  -H "Content-Type: application/json" \
  -d '{submissionId, judgeUserId, finalDecision, finalScore, remarks}'
```
- [ ] Returns HTTP 400
- [ ] Error message includes "must be EVALUATED"

---

## Phase 4: Error Handling Verification 🚨

### Test Error Cases

#### Invalid Score (Out of Range)
- [ ] Submit score 150 → Returns 400 with "must be between 0 and 100"
- [ ] Submit score -10 → Returns 400 with "must be between 0 and 100"

#### Missing Required Fields
- [ ] Submit without criteriaScores → Returns 400 with "at least one criterion required"
- [ ] Submit without evaluatorId → Returns 400 with validation error

#### Nonexistent Resources
- [ ] Evaluate nonexistent submission → Returns 400
- [ ] Judge with nonexistent judge user → Returns 400
- [ ] Reference nonexistent criteria → Returns 400

#### Workflow Violations
- [ ] Judge before evaluate → Returns 400 with "must be EVALUATED first"
- [ ] Evaluate twice → Returns 400 with "already evaluated"

---

## Phase 5: Data Integrity Verification 📊

### Database Verification Queries

```sql
-- Verify evaluation record created
SELECT e.evaluation_id, e.application_id, e.evaluator_id, e.evaluation_status
FROM evaluations e
ORDER BY e.evaluation_id DESC LIMIT 1;

-- Verify evaluation scores inserted
SELECT es.score_id, es.evaluation_id, es.criteria_id, es.score_value, es.weighted_score
FROM evaluation_scores es
WHERE es.evaluation_id = 1;

-- Verify total weighted score
SELECT SUM(es.weighted_score) as total_score
FROM evaluation_scores es
WHERE es.evaluation_id = 1;

-- Verify judge record created
SELECT j.judge_id, j.user_id, j.application_id, j.final_score, j.final_decision
FROM judges j
ORDER BY j.judge_id DESC LIMIT 1;

-- Verify application status updated
SELECT a.id, a.evaluation_status, a.manual_score, a.judge_score, a.decision
FROM applications a
WHERE a.id = 1;

-- Verify notifications created
SELECT n.notification_id, n.user_id, n.message, n.created_at
FROM notifications n
ORDER BY n.created_at DESC LIMIT 5;
```

- [ ] Evaluation records created with correct evaluator_id
- [ ] EvaluationScore records created for each criterion
- [ ] Weighted scores calculated correctly (0-100 scale)
- [ ] Total score normalized correctly
- [ ] Judge records created after finalization
- [ ] Application status transitions: SUBMITTED → EVALUATED → JUDGED
- [ ] Notification records created for team and evaluator

---

## Phase 6: Performance Testing 🚀

### Load Testing (Optional)

```bash
# Submit 10 evaluations
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/evaluations \
    -H "Content-Type: application/json" \
    -d "{...}" &
done
wait

# Check response times (should be < 1 second each)
# Monitor CPU/memory usage
# Verify no connection pool exhaustion
```

- [ ] Evaluation submission < 500ms
- [ ] Judge finalization < 500ms
- [ ] Evaluation summary retrieval < 2 seconds
- [ ] No database connection errors
- [ ] No memory leaks

### Database Performance
- [ ] Query response time < 100ms
- [ ] No slow query warnings
- [ ] Indexes used efficiently

---

## Phase 7: Frontend Integration Readiness 🎨

### API Accessibility for Frontend
- [ ] CORS enabled (@CrossOrigin("*"))
- [ ] JSON responses parseable by JavaScript
- [ ] All endpoints return consistent response format
- [ ] Error messages clear and actionable

### Frontend Components Required (TODO)
- [ ] Evaluator Dashboard component
- [ ] Evaluation scoring form (6 criteria inputs)
- [ ] Judge Dashboard component
- [ ] Judge decision form
- [ ] Real-time score calculation preview
- [ ] Notification integration

---

## Phase 8: Documentation Review ✓

### Documentation Completeness
- [ ] EVALUATION_SYSTEM_IMPLEMENTATION.md reviewed
- [ ] API_TESTING_GUIDE.md verified with working examples
- [ ] QUICK_REFERENCE.md accessible to team
- [ ] IMPLEMENTATION_COMPLETE.md archived

### Team Knowledge Transfer
- [ ] Developer team read documentation
- [ ] Team understands two-stage workflow
- [ ] Team understands score calculation
- [ ] Team knows how to test endpoints

---

## Phase 9: Rollback Plan 🔄

### If Issues Occur
- [ ] Have backup of pre-migration database
- [ ] Document all changes made
- [ ] Document any custom configurations
- [ ] Have rollback scripts prepared
- [ ] Document any data corrections needed

### Rollback Steps (If Needed)
1. [ ] Stop Spring Boot application
2. [ ] Restore database backup
3. [ ] Revert any code changes
4. [ ] Restart application
5. [ ] Verify pre-migration state

---

## Phase 10: Post-Deployment Monitoring 📈

### Ongoing Monitoring
- [ ] Monitor application logs for errors
- [ ] Track API response times
- [ ] Monitor database connections
- [ ] Check notification delivery
- [ ] Verify no data corruption
- [ ] Check disk space usage
- [ ] Monitor database backup status

### Weekly Checks
- [ ] Review application logs
- [ ] Check API performance metrics
- [ ] Verify all endpoints still working
- [ ] Check evaluation/judge data volumes
- [ ] Verify no orphaned records

---

## Deployment Completion Checklist

### Pre-Deployment
- [ ] Database backup created
- [ ] SQL migration reviewed
- [ ] Code compiled without errors
- [ ] Configuration verified

### Deployment
- [ ] Application started successfully
- [ ] All 9 endpoints responding
- [ ] Error handling verified
- [ ] Data integrity confirmed

### Post-Deployment
- [ ] Database verified with test data
- [ ] Performance acceptable
- [ ] Frontend integration readiness confirmed
- [ ] Team trained on new system
- [ ] Documentation archived

### Final Approval
- [ ] Product Owner Sign-off: _______
- [ ] Tech Lead Approval: _______
- [ ] QA Lead Approval: _______
- [ ] Deployment Date: _______

---

## Support Contacts

| Role | Name | Contact | Issue Type |
|------|------|---------|-----------|
| Tech Lead | [Name] | [Email] | Architecture, Config |
| QA Lead | [Name] | [Email] | Testing, Bugs |
| Database Admin | [Name] | [Email] | Database, Backups |
| DevOps | [Name] | [Email] | Deployment, Monitoring |

---

## Reference Files

- **Schema Migration:** `mysql_hackathon_schema_update.sql`
- **Implementation Guide:** `EVALUATION_SYSTEM_IMPLEMENTATION.md`
- **Testing Guide:** `API_TESTING_GUIDE.md`
- **Quick Reference:** `QUICK_REFERENCE.md`
- **This Checklist:** `DEPLOYMENT_CHECKLIST.md`

---

## Notes

```
[Space for deployment notes]


```

---

**Deployment Status:** NOT YET STARTED  
**Last Updated:** [Deployment Date]  
**Deployed By:** [Your Name]

