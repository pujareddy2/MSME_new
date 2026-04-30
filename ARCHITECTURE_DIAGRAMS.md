# System Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  Evaluator Dashboard      Judge Dashboard      Admin Summary  │  │
│  │  ┌─────────────────┐     ┌──────────────┐     ┌────────────┐ │  │
│  │  │ • Score Form    │     │ • View Eval  │     │ • All Evals│ │  │
│  │  │ • Criteria List │     │ • Decision   │     │ • Stats    │ │  │
│  │  │ • Auto Calc     │     │ • Judge Form │     │ • Export   │ │  │
│  │  └─────────────────┘     └──────────────┘     └────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ REST API Calls (JSON)
         ┌─────────────┼─────────────┬──────────────┐
         │             │             │              │
    ┌────▼────────┬────▼────────┬────▼────────┐    │
    │ /api/       │ /api/       │ /api/judge/ │    │
    │ evaluations │ submissions │             │    │
    └────┬────────┴────┬────────┴────┬────────┘    │
         │             │             │             │
┌────────▼─────────────▼─────────────▼──────────────▼────────┐
│                  Spring Boot Backend                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            REST Controllers (2)                      │  │
│  │  ┌───────────────────────┬──────────────────────┐   │  │
│  │  │ EvaluationController  │ JudgeController      │   │  │
│  │  │  • POST /evaluations  │  • POST /finalize    │   │  │
│  │  │  • GET /criteria      │  • GET /dashboard    │   │  │
│  │  │  • GET /details       │  • GET /pending-cnt  │   │  │
│  │  │  • GET /summary       │                      │   │  │
│  │  └───────────────────────┴──────────────────────┘   │  │
│  └──────────────────┬───────────────────────────────────┘  │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │         Service Layer (2 Services)                  │  │
│  │  ┌──────────────────────┬─────────────────────────┐ │  │
│  │  │  EvaluationService   │  JudgeService           │ │  │
│  │  │  • submitEvaluation  │  • finalizeProblem      │ │  │
│  │  │  • getDetails        │  • getPendingJudgments  │ │  │
│  │  │  • getSummary        │  • validateEvaluated    │ │  │
│  │  │  • getAllCriteria    │                         │ │  │
│  │  │                      │  ⚡ CRITICAL:           │ │  │
│  │  │  ⚡ Calculate:        │  Enforces status=      │ │  │
│  │  │  weighted_score =    │  EVALUATED before      │ │  │
│  │  │  (score/max) *       │  judging               │ │  │
│  │  │  weight%             │                         │ │  │
│  │  └──────────────────────┴─────────────────────────┘ │  │
│  └──────────────────┬───────────────────────────────────┘  │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │      Repository Layer (4 Repositories)              │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ EvaluationRepository                         │   │  │
│  │  │ • findByApplication_Id()                     │   │  │
│  │  │ • findByApplication_Problem_ProblemId()      │   │  │
│  │  │ • countCompletedEvaluationsByProblem()       │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ EvaluationScoreRepository                    │   │  │
│  │  │ • findByEvaluation_EvaluationId()            │   │  │
│  │  │ • sumWeightedScoresByEvaluation()            │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ EvaluationCriteriaRepository                 │   │  │
│  │  │ • findByCriteriaName()                       │   │  │
│  │  │ • findAllByOrderByCriteriaId()               │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ JudgeRepository                              │   │  │
│  │  │ • findByUser_UserId()                        │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────┬───────────────────────────────────┘  │
└──────────────────────┼────────────────────────────────────┘
                       │ JPA/Hibernate
                       │
┌──────────────────────▼────────────────────────────────────┐
│                  MySQL Database                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ applications                                         │ │
│  │ • id (PK)           • evaluation_status              │ │
│  │ • problem_id (FK)   • manual_score                   │ │
│  │ • team_id (FK)      • judge_score                    │ │
│  │ • judge_id (FK) ────┐                                │ │
│  └──────────────────────┼────────────────────────────────┘ │
│  ┌──────────────────────▼────────────────────────────────┐ │
│  │ evaluations                                          │ │
│  │ • evaluation_id (PK)    • evaluator_id (FK) ──────┐ │ │
│  │ • application_id (FK)   • evaluation_status        │ │ │
│  │ • comments              • evaluated_at             │ │ │
│  └──────────────────────┬───────────────────────────────┘ │ │
│  ┌──────────────────────▼────────────────────────────────┐ │ │
│  │ evaluation_scores                                    │ │ │
│  │ • score_id (PK)          • criteria_id (FK) ──┐     │ │ │
│  │ • evaluation_id (FK)     • score_value        │     │ │ │
│  │ • weighted_score                             │     │ │ │
│  │ • review_comments                            │     │ │ │
│  └──────────────────────┬────────────────────────┼─────┘ │ │
│  ┌──────────────────────▼────────────────────────▼─────┐ │ │
│  │ evaluation_criteria                                  │ │ │
│  │ • criteria_id (PK)    • weight_percentage (16.67%) │ │ │
│  │ • criteria_name       • max_score (100)           │ │ │
│  │ • description         • 6 rows (Abstract, Innov.  │ │ │
│  │                         Tech Stack, Impl.,        │ │ │
│  │                         UI/UX, Code Quality)       │ │ │
│  └──────────────────────────────────────────────────────┘ │ │
│  ┌──────────────────────────────────────────────────────┐ │ │
│  │ judges                                               │ │ │
│  │ • judge_id (PK)      • final_score                 │ │ │
│  │ • user_id (FK)       • final_decision              │ │ │
│  │ • application_id (FK)• remarks                     │ │ │
│  │ • judged_at                                        │ │ │
│  └──────────────────────────────────────────────────────┘ │ │
│  ┌──────────────────────────────────────────────────────┐ │ │
│  │ users        roles          notifications           │ │ │
│  │ • user_id    • role_id      • notification_id      │ │ │
│  │ • role_id ─┐ • role_name    • user_id (FK)        │ │ │
│  │            └─┴──────────────┐ • message             │ │ │
│  │                  6 rows:      • created_at          │ │ │
│  │                  ADMIN,        • is_read             │ │ │
│  │                  TEAM_LEAD,                         │ │ │
│  │                  TEAM_MEMBER,                       │ │ │
│  │                  EVALUATOR,                         │ │ │
│  │                  JUDGE,                             │ │ │
│  │                  MENTOR                             │ │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

## Data Flow Diagram - Evaluation Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        EVALUATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: Team Submits Application
  ┌─────────────┐
  │   Team      │
  │  Submits    │
  └──────┬──────┘
         │ POST /api/applications
         ▼
  ┌──────────────────┐
  │  Application     │
  │  status=         │
  │  SUBMITTED       │
  └──────────────────┘

Step 2: Evaluator Views & Scores
  ┌──────────────────┐
  │   Evaluator      │
  │  Dashboard       │
  │ (GET /criteria)  │
  └────────┬─────────┘
           │ Shows 6 criteria form
           ▼
  ┌──────────────────┐
  │  Scoring Form    │
  │  • Abstract      │
  │  • Innovation    │
  │  • Tech Stack    │
  │  • Impl.         │
  │  • UI/UX         │
  │  • Code Quality  │
  └────────┬─────────┘
           │ POST /api/evaluations
           ▼
  
  EvaluationService.submitEvaluation():
    1. Validate scores (0-100)
    2. Create Evaluation record
    3. Create EvaluationScore for each:
       weighted = (score/100) * 16.67%
    4. Sum weighted scores → normalize to 0-100
    5. Update Application.evaluationStatus = EVALUATED
    6. Send notification to team
           │
           ▼
  ┌──────────────────┐
  │  Application     │
  │  status=         │
  │  EVALUATED       │
  │  score≈85.0      │
  └──────────────────┘

Step 3: Judge Reviews & Decides
  ┌──────────────────┐
  │     Judge        │
  │   Dashboard      │
  │(GET /dashboard)  │
  └────────┬─────────┘
           │ Shows all EVALUATED submissions
           ▼
  ┌──────────────────┐
  │  Judgment Form   │
  │  • Show scores   │
  │  • Show eval     │
  │  • Add decision  │
  │  • Add remarks   │
  └────────┬─────────┘
           │ POST /api/judge/finalize
           ▼
  
  JudgeService.finalizeProblem():
    1. ✓ VALIDATE: status == EVALUATED
       (Critical: prevents judging unevaluated)
    2. Create Judge record
    3. Update Application:
       - judge_id, judge_score, decision
       - status = JUDGED
    4. Send notifications
           │
           ▼
  ┌──────────────────┐
  │  Application     │
  │  status=         │
  │  JUDGED          │
  │  judge_score=87  │
  │  decision=APPROV │
  └──────────────────┘

Step 4: Team Receives Results
  ┌──────────────────┐
  │     Team         │
  │  Receives        │
  │  Notification    │
  │  (Decision +     │
  │   Score)         │
  └──────────────────┘
```

## Score Calculation Flow

```
┌────────────────────────────────────────────────────────┐
│            Score Calculation Example                    │
└────────────────────────────────────────────────────────┘

INPUT: Evaluator scores 6 criteria
  Criterion          Score    Weight
  ─────────────────────────────────
  1. Abstract         85       16.67%
  2. Innovation       90       16.67%
  3. Tech Stack       78       16.67%
  4. Implementation   88       16.67%
  5. UI/UX Design     92       16.67%
  6. Code Quality     85       16.67%

CALCULATION:
  weighted_score = (score / max_score) * weight_percentage
  
  1. (85/100) × 16.67 = 14.17
  2. (90/100) × 16.67 = 15.00
  3. (78/100) × 16.67 = 13.00
  4. (88/100) × 16.67 = 14.67
  5. (92/100) × 16.67 = 15.34
  6. (85/100) × 16.67 = 14.17
  ─────────────────────────────
  TOTAL WEIGHTED    = 86.35

NORMALIZATION:
  Since total_weight = 100% (all 6 criteria scored)
  normalized_score = 86.35 / 100 = 86.35/100
  
OUTPUT: normalizedScore = 86.35
        Application.manualScore = 86 (as integer)

STORAGE IN DB:
  evaluations → evaluation_id, application_id, evaluator_id
  evaluation_scores → [
    {score_value: 85, weighted_score: 14.17},
    {score_value: 90, weighted_score: 15.00},
    ...
  ]
  applications → manual_score: 86
```

## Workflow State Machine

```
Application Status Transitions:
  
  ┌─────────────┐
  │  SUBMITTED  │ (Initial state when team applies)
  └──────┬──────┘
         │ POST /api/evaluations
         │ EvaluationService.submitEvaluation()
         ▼
  ┌─────────────┐
  │ EVALUATED   │ (After evaluator submits scores)
  └──────┬──────┘
         │ POST /api/judge/finalize
         │ JudgeService.finalizeProblem()
         │ ✓ Validates status == EVALUATED
         ▼
  ┌─────────────┐
  │   JUDGED    │ (After judge submits decision)
  └─────────────┘

Cannot proceed backward!
  • Cannot evaluate twice
  • Cannot judge before evaluation
  • Cannot skip evaluation stage
```

## Error Handling Flow

```
API Request
    │
    ▼
Input Validation
    │
    ├─ Invalid score (>100) ──────────┐
    ├─ Missing fields ────────────────┤
    ├─ Invalid user ID ───────────────┤
    │                                 │
    ▼                                 │
Business Logic Validation             │
    │                                 │
    ├─ Resource not found ────────────┤
    ├─ Already evaluated ─────────────┤
    ├─ Not evaluated yet ─────────────┤
    │ (judge before evaluate)         │
    │                                 │
    ▼                                 │
Database Operation                    │
    │                                 │
    ├─ FK constraint violation ───────┤
    ├─ Connection error ──────────────┤
    │                                 │
    ▼                                 │
Success ◄────────────────────────────┘
    │
    ▼
JSON Response {
  success: true,
  data: { ... }
}

Error
    │
    ▼
HTTP 400/404/500
{
  success: false,
  message: "Error description"
}
```

## DTO Relationship Diagram

```
Request Objects:
  ┌──────────────────────────┐
  │EvaluationSubmissionRequest
  ├──────────────────────────┤
  │ submissionId: Long       │
  │ evaluatorId: Long        │
  │ overallReview: String    │
  │ criteriaScores: List ─────────┐
  └──────────────────────────┘    │
                                   ▼
                        ┌──────────────────────────┐
                        │EvaluationCriterionScore  │
                        │Request                   │
                        ├──────────────────────────┤
                        │ criteriaId: Long         │
                        │ score: Integer (0-100)   │
                        │ reviewText: String       │
                        └──────────────────────────┘

  ┌──────────────────────┐
  │JudgeFinalizeRequest  │
  ├──────────────────────┤
  │ submissionId: Long   │
  │ judgeUserId: Long    │
  │ finalDecision: String│
  │ finalScore: Double   │
  │ remarks: String      │
  └──────────────────────┘

Response Objects:
  ┌──────────────────────────────────┐
  │SubmissionDetailsResponse         │
  ├──────────────────────────────────┤
  │ submissionId: Long               │
  │ problemId: Long                  │
  │ teamId: Long, teamName: String   │
  │ evaluatorId: Long, Name: String  │
  │ overallReview: String            │
  │ totalScore: Double               │
  │ normalizedScore: Double          │
  │ criteriaScores: List ────────────┐
  │ judgeId: Long, judgeName: String │
  │ judgeScore: Double               │
  │ finalDecision: String            │
  │ judgeRemarks: String             │
  └──────────────────────────────────┘
           ▲
           │
           └──────────┐
                      │
           ┌──────────▼─────────────────┐
           │EvaluationCriterionView     │
           ├────────────────────────────┤
           │ criteriaId: Long           │
           │ criteriaName: String       │
           │ description: String        │
           │ weightPercentage: Double   │
           │ maxScore: Double           │
           │ scoreValue: Double ◄─ Actual score
           │ weightedScore: Double      │
           │ reviewComments: String     │
           └────────────────────────────┘

  ┌──────────────────────────────────┐
  │ProblemEvaluationSummaryResponse  │
  ├──────────────────────────────────┤
  │ problemId: Long                  │
  │ problemTitle: String             │
  │ submissionCount: Integer         │
  │ evaluationCount: Integer         │
  │ results: List ────────────────────┤
  │          (SubmissionDetailsResp) │
  └──────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────┐
│     Development Machine          │
├─────────────────────────────────┤
│ Git Repository                  │
│ • Code files                    │
│ • SQL migration script          │
│ • Documentation                 │
└────────────┬────────────────────┘
             │ git push
             ▼
┌─────────────────────────────────┐
│  Production Server               │
├─────────────────────────────────┤
│ Spring Boot Application          │
│ • EvaluationController           │
│ • JudgeController                │
│ • EvaluationService              │
│ • JudgeService                   │
│ • Repositories                   │
│ (Port 8080)                      │
└────────────┬────────────────────┘
             │ JPA/Hibernate
             ▼
┌─────────────────────────────────┐
│    MySQL Database Server         │
├─────────────────────────────────┤
│ • evaluations                   │
│ • evaluation_scores             │
│ • judges                         │
│ • evaluation_criteria (6 rows)  │
│ • users (with role_id)          │
│ • applications (status field)   │
│ • notifications                 │
└─────────────────────────────────┘
```

