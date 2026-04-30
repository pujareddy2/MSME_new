# API Testing Guide - Evaluation & Judging System

## Quick Start: Test the Evaluation & Judging APIs

### Prerequisites
- Spring Boot backend running on `http://localhost:8080`
- MySQL with schema migration applied
- Postman or curl installed

---

## 1. Setup Test Data

### Create Test Users (if not exists)
Assuming users table has: user_id, email, full_name, password_hash, role_id

```sql
-- Evaluator
INSERT INTO users (email, full_name, password_hash, role_id) 
VALUES ('evaluator@test.com', 'Dr. John Evaluator', 'hash123', 4);
-- ID should be: 1

-- Judge
INSERT INTO users (email, full_name, password_hash, role_id) 
VALUES ('judge@test.com', 'Justice Jane Judge', 'hash456', 5);
-- ID should be: 2

-- Team Lead
INSERT INTO users (email, full_name, password_hash, role_id) 
VALUES ('lead@team.com', 'Alice Team Lead', 'hash789', 2);
-- ID should be: 3
```

### Get Your IDs
```sql
SELECT user_id, email, full_name, role_id FROM users 
WHERE role_id IN (4, 5, 2);  -- EVALUATOR, JUDGE, TEAM_LEAD
```

---

## 2. Test Sequence

### Step 1: Get Evaluation Criteria

**Endpoint:** `GET http://localhost:8080/api/evaluation-criteria`

**Curl:**
```bash
curl -X GET "http://localhost:8080/api/evaluation-criteria" \
  -H "Accept: application/json"
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "criteriaId": 1,
      "criteriaName": "Abstract",
      "description": "Quality and clarity of the abstract",
      "weightPercentage": 16.67,
      "maxScore": 100.0
    },
    {
      "criteriaId": 2,
      "criteriaName": "Innovation",
      "description": "Originality and uniqueness of the idea",
      "weightPercentage": 16.67,
      "maxScore": 100.0
    },
    ...
  ]
}
```

### Step 2: Get Submission Count for a Problem

**Endpoint:** `GET http://localhost:8080/api/evaluations/problems/{problemId}/solutions/count`

Example: Problem ID = 1

**Curl:**
```bash
curl -X GET "http://localhost:8080/api/evaluations/problems/1/solutions/count" \
  -H "Accept: application/json"
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "problemId": 1,
    "submissionCount": 5
  }
}
```

### Step 3: Submit Evaluation (Core Test)

**Endpoint:** `POST http://localhost:8080/api/evaluations`

**Curl:**
```bash
curl -X POST "http://localhost:8080/api/evaluations" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": 1,
    "evaluatorId": 1,
    "overallReview": "Strong technical foundation with excellent innovation",
    "criteriaScores": [
      {
        "criteriaId": 1,
        "score": 85,
        "reviewText": "Well-structured and clear abstract"
      },
      {
        "criteriaId": 2,
        "score": 92,
        "reviewText": "Very innovative and unique approach"
      },
      {
        "criteriaId": 3,
        "score": 78,
        "reviewText": "Good technology choices"
      },
      {
        "criteriaId": 4,
        "score": 88,
        "reviewText": "Feasible and well-planned implementation"
      },
      {
        "criteriaId": 5,
        "score": 90,
        "reviewText": "Excellent UI/UX design and user experience"
      },
      {
        "criteriaId": 6,
        "score": 85,
        "reviewText": "Clean, maintainable, and well-documented code"
      }
    ]
  }'
```

**Postman Body (JSON):**
```json
{
  "submissionId": 1,
  "evaluatorId": 1,
  "overallReview": "Strong technical foundation with excellent innovation",
  "criteriaScores": [
    {
      "criteriaId": 1,
      "score": 85,
      "reviewText": "Well-structured and clear abstract"
    },
    {
      "criteriaId": 2,
      "score": 92,
      "reviewText": "Very innovative and unique approach"
    },
    {
      "criteriaId": 3,
      "score": 78,
      "reviewText": "Good technology choices"
    },
    {
      "criteriaId": 4,
      "score": 88,
      "reviewText": "Feasible and well-planned implementation"
    },
    {
      "criteriaId": 5,
      "score": 90,
      "reviewText": "Excellent UI/UX design and user experience"
    },
    {
      "criteriaId": 6,
      "score": 85,
      "reviewText": "Clean, maintainable, and well-documented code"
    }
  ]
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Evaluation submitted successfully",
  "data": {
    "submissionId": 1,
    "problemId": 1,
    "problemTitle": "Sustainable Agriculture Solution",
    "teamId": 1,
    "teamName": "Team Alpha",
    "evaluatorId": 1,
    "evaluatorName": "Dr. John Evaluator",
    "overallReview": "Strong technical foundation with excellent innovation",
    "evaluationStatus": "COMPLETED",
    "totalScore": 86.33,
    "normalizedScore": 86.33,
    "criteriaScores": [
      {
        "criteriaId": 1,
        "criteriaName": "Abstract",
        "description": "Quality and clarity of the abstract",
        "weightPercentage": 16.67,
        "maxScore": 100.0,
        "scoreValue": 85.0,
        "weightedScore": 14.17,
        "reviewComments": "Well-structured and clear abstract"
      },
      ...
    ],
    "judgeId": null,
    "judgeName": null,
    "judgeScore": null,
    "finalDecision": null,
    "judgeRemarks": null
  }
}
```

**Score Calculation Verification:**
```
Scores: [85, 92, 78, 88, 90, 85]
Weighted (each * 16.67%):
  14.17 + 15.34 + 13.00 + 14.67 + 15.00 + 14.17 = 86.35
Normalized: 86.35 / 100 = 86.35/100 ✓
```

### Step 4: Get Evaluation Details

**Endpoint:** `GET http://localhost:8080/api/evaluations/{submissionId}`

Example: Submission ID = 1

**Curl:**
```bash
curl -X GET "http://localhost:8080/api/evaluations/1" \
  -H "Accept: application/json"
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "submissionId": 1,
    ...same as Step 3 response...
  }
}
```

### Step 5: Get Judge Dashboard (Pending Submissions)

**Endpoint:** `GET http://localhost:8080/api/judge/dashboard`

**Curl:**
```bash
curl -X GET "http://localhost:8080/api/judge/dashboard" \
  -H "Accept: application/json"
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "submissionId": 1,
      ...evaluation data...
    }
  ]
}
```

### Step 6: Submit Judge Decision

**Endpoint:** `POST http://localhost:8080/api/judge/finalize`

**Curl:**
```bash
curl -X POST "http://localhost:8080/api/judge/finalize" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": 1,
    "judgeUserId": 2,
    "finalDecision": "APPROVED",
    "finalScore": 86.5,
    "remarks": "Excellent solution. Ready for top 5. Strong on all fronts."
  }'
```

**Postman Body (JSON):**
```json
{
  "submissionId": 1,
  "judgeUserId": 2,
  "finalDecision": "APPROVED",
  "finalScore": 86.5,
  "remarks": "Excellent solution. Ready for top 5. Strong on all fronts."
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Judgment submitted successfully",
  "data": {
    "submissionId": 1,
    ...all previous evaluation data...,
    "judgeId": 2,
    "judgeName": "Justice Jane Judge",
    "judgeScore": 86.5,
    "finalDecision": "APPROVED",
    "judgeRemarks": "Excellent solution. Ready for top 5. Strong on all fronts."
  }
}
```

### Step 7: Get Evaluation Summary for Problem

**Endpoint:** `GET http://localhost:8080/api/evaluations/problems/{problemId}/evaluation-summary`

Example: Problem ID = 1

**Curl:**
```bash
curl -X GET "http://localhost:8080/api/evaluations/problems/1/evaluation-summary" \
  -H "Accept: application/json"
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "problemId": 1,
    "problemTitle": "Sustainable Agriculture Solution",
    "submissionCount": 5,
    "evaluationCount": 1,
    "results": [
      {
        "submissionId": 1,
        ...full submission details with evaluation and judge data...
      }
    ]
  }
}
```

---

## 3. Error Testing

### Test Case: Invalid Score (Out of Range)

**Curl:**
```bash
curl -X POST "http://localhost:8080/api/evaluations" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": 2,
    "evaluatorId": 1,
    "overallReview": "Test",
    "criteriaScores": [
      {"criteriaId": 1, "score": 150, "reviewText": "Invalid score"}
    ]
  }'
```

**Expected Response:** 400 Bad Request
```json
{
  "success": false,
  "message": "Criterion score must be between 0 and 100. Got: 150"
}
```

### Test Case: Judge Before Evaluate

**Curl:**
```bash
curl -X POST "http://localhost:8080/api/judge/finalize" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": 3,
    "judgeUserId": 2,
    "finalDecision": "APPROVED",
    "finalScore": 85,
    "remarks": "Test"
  }'
```

**Expected Response:** 400 Bad Request
```json
{
  "success": false,
  "message": "Cannot judge. Application must be EVALUATED first. Current status: SUBMITTED"
}
```

### Test Case: Nonexistent Submission

**Curl:**
```bash
curl -X POST "http://localhost:8080/api/evaluations" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": 999,
    "evaluatorId": 1,
    "overallReview": "Test",
    "criteriaScores": [{"criteriaId": 1, "score": 85, "reviewText": "Test"}]
  }'
```

**Expected Response:** 400 Bad Request
```json
{
  "success": false,
  "message": "Application/Submission not found with ID: 999"
}
```

---

## 4. Postman Collection Template

Save as `evaluation-api.postman_collection.json`:

```json
{
  "info": {
    "name": "Evaluation & Judging APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Get Evaluation Criteria",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/evaluation-criteria"
      }
    },
    {
      "name": "2. Get Submission Count",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/evaluations/problems/1/solutions/count"
      }
    },
    {
      "name": "3. Submit Evaluation",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/evaluations",
        "body": {
          "mode": "raw",
          "raw": "{...see Step 3 JSON...}"
        }
      }
    },
    {
      "name": "4. Get Evaluation Details",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/evaluations/1"
      }
    },
    {
      "name": "5. Get Judge Dashboard",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/judge/dashboard"
      }
    },
    {
      "name": "6. Submit Judge Decision",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/judge/finalize",
        "body": {
          "mode": "raw",
          "raw": "{...see Step 6 JSON...}"
        }
      }
    }
  ]
}
```

---

## 5. Database Verification Queries

After running tests, verify data in database:

```sql
-- View all evaluations
SELECT e.evaluation_id, e.application_id, e.evaluator_id, e.evaluation_status, e.comments
FROM evaluations e;

-- View all evaluation scores
SELECT es.score_id, es.evaluation_id, es.criteria_id, es.score_value, es.weighted_score
FROM evaluation_scores es;

-- View all judges
SELECT j.judge_id, j.user_id, j.application_id, j.final_score, j.final_decision
FROM judges j;

-- View application status
SELECT a.id, a.evaluation_status, a.manual_score, a.judge_score, a.decision
FROM applications a;
```

---

## 6. Common Issues & Solutions

### Issue: "Cannot judge. Application must be EVALUATED first"
**Cause:** Trying to judge before evaluating
**Solution:** Submit evaluation first (Step 3) before judging (Step 6)

### Issue: "Criterion score must be between 0 and 100"
**Cause:** Score value outside valid range
**Solution:** Ensure all scores in criteriaScores array are between 0 and 100

### Issue: "Evaluator not found with ID: X"
**Cause:** evaluatorId doesn't exist in users table
**Solution:** Verify user exists and has role_id = 4 (EVALUATOR)

### Issue: Response shows null judge fields
**Cause:** Submission not yet judged
**Solution:** Normal if only evaluated; submit judge decision to populate judge fields

### Issue: Empty criteria scores in response
**Cause:** Possible database insert issue
**Solution:** Check evaluation_scores table has records; verify FK constraints

---

## 7. Performance Test (Optional)

### Bulk Submission Evaluation
```bash
# Submit 10 evaluations sequentially
for i in {1..10}; do
  curl -X POST "http://localhost:8080/api/evaluations" \
    -H "Content-Type: application/json" \
    -d "{
      \"submissionId\": $i,
      \"evaluatorId\": 1,
      \"overallReview\": \"Evaluation $i\",
      \"criteriaScores\": [
        {\"criteriaId\": 1, \"score\": $((50 + RANDOM % 50)), \"reviewText\": \"Score\"},
        {\"criteriaId\": 2, \"score\": $((50 + RANDOM % 50)), \"reviewText\": \"Score\"},
        {\"criteriaId\": 3, \"score\": $((50 + RANDOM % 50)), \"reviewText\": \"Score\"},
        {\"criteriaId\": 4, \"score\": $((50 + RANDOM % 50)), \"reviewText\": \"Score\"},
        {\"criteriaId\": 5, \"score\": $((50 + RANDOM % 50)), \"reviewText\": \"Score\"},
        {\"criteriaId\": 6, \"score\": $((50 + RANDOM % 50)), \"reviewText\": \"Score\"}
      ]
    }"
  echo "Submitted evaluation $i"
done
```

---

**Test completed? Great! Your evaluation system is ready for production.**
