import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { finalizeJudgeDecision, getApplicationById, getSubmissionDetails, unwrapApiData } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./judging.css";

function Judge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getStoredUser();

  const [report, setReport] = useState(location.state?.submission || null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finalDecision, setFinalDecision] = useState("APPROVED");
  const [finalScore, setFinalScore] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSubmission() {
      try {
        setLoading(true);

        const [reportResponse, applicationResponse] = await Promise.all([
          getSubmissionDetails(id).catch(() => null),
          getApplicationById(id).catch(() => null),
        ]);

        if (cancelled) {
          return;
        }

        const submission = location.state?.submission || unwrapApiData(reportResponse);
        const applicationData = unwrapApiData(applicationResponse);

        setReport(submission);
        setApplication(applicationData);

        const scoreSeed = submission?.judgeScore ?? submission?.totalScore ?? submission?.normalizedScore ?? applicationData?.judgeScore ?? "";
        setFinalScore(scoreSeed === null || scoreSeed === undefined ? "" : String(scoreSeed));
        setRemarks(submission?.judgeRemarks || submission?.overallReview || "");
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setReport(location.state?.submission || null);
          setApplication(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSubmission();

    return () => {
      cancelled = true;
    };
  }, [id, location.state]);

  const status = useMemo(() => {
    return (report?.evaluationStatus || application?.evaluationStatus || application?.submissionStatus || "EVALUATED").toUpperCase();
  }, [report, application]);

  const criteriaRows = report?.criteriaScores || [];
  const isJudged = status === "JUDGED" || Boolean(report?.finalDecision && report.finalDecision !== "PENDING");

  const handleCompleteJudging = async () => {
    if (!currentUser?.userId) {
      alert("Judge session not found. Please log in again.");
      navigate("/login");
      return;
    }

    if (!finalScore) {
      alert("Please enter judge score.");
      return;
    }

    const numericScore = Number(finalScore);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      alert("Judge score must be between 0 and 100.");
      return;
    }

    if ((remarks || "").trim() === "") {
      alert("Judge remarks are required.");
      return;
    }

    if (isJudged) {
      alert("This application has already been judged.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await finalizeJudgeDecision({
        submissionId: Number(id),
        judgeUserId: currentUser.userId,
        finalDecision,
        finalScore: numericScore,
        remarks: remarks.trim(),
      });

      const reportResponse = unwrapApiData(response);
      navigate(`/judge/report/${id}`, {
        state: { submission: reportResponse, fromJudge: true },
      });
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message || "Unable to submit judgment.";
      alert(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="workspace-loading">Loading application...</p>;
  }

  if (!report && !application) {
    return <p className="workspace-loading">Application not found.</p>;
  }

  return (
    <div className={`judge-page-wrap judge-workspace-wrap ${isJudged ? "report-judged" : "report-evaluated"}`}>
      <div className="judge-card judge-workflow-card">
        <div className="workspace-header">
          <div>
            <p className="workspace-eyebrow">Judge Workspace</p>
            <h2 className="judge-card-title">Final Decision Panel</h2>
            <p className="workspace-subtitle">Review the evaluator scores, compare AI context, and publish the final verdict.</p>
          </div>

          <span className={`status-badge ${isJudged ? "status-judged" : "status-pending"}`}>{status}</span>
        </div>

        <div className="workspace-summary-grid">
          <article className="workspace-summary-card">
            <span>Team</span>
            <strong>{report?.teamName || application?.team?.teamName || "N/A"}</strong>
          </article>
          <article className="workspace-summary-card">
            <span>Problem</span>
            <strong>{report?.problemTitle || application?.problem?.problemTitle || application?.problem?.title || "N/A"}</strong>
          </article>
          <article className="workspace-summary-card">
            <span>Evaluator Score</span>
            <strong>{report?.totalScore ?? report?.normalizedScore ?? "-"}</strong>
          </article>
          <article className="workspace-summary-card">
            <span>AI Score</span>
            <strong>{application?.aiScore ?? "-"}</strong>
          </article>
        </div>

        <section className="judge-section-box report-hero-box">
          <div className="report-meta-grid">
            <div>
              <p className="meta-label">Evaluator</p>
              <p className="meta-value">{report?.evaluatorName || "N/A"}</p>
            </div>
            <div>
              <p className="meta-label">Judge</p>
              <p className="meta-value">{report?.judgeName || application?.judgedBy || "N/A"}</p>
            </div>
            <div>
              <p className="meta-label">Submission ID</p>
              <p className="meta-value">{report?.submissionId || application?.applicationId || application?.id || id}</p>
            </div>
            <div>
              <p className="meta-label">Criteria</p>
              <p className="meta-value">{criteriaRows.length}</p>
            </div>
          </div>
        </section>

        <section className="judge-section-box report-score-grid report-breakdown-box">
          <h4>Evaluator Breakdown</h4>
          {criteriaRows.length === 0 ? (
            <p className="workspace-empty-state">No evaluator scores were returned by the backend.</p>
          ) : (
            <div className="report-breakdown-list">
              {criteriaRows.map((criterion) => (
                <article key={criterion.criteriaId} className="report-breakdown-card">
                  <div>
                    <strong>{criterion.criteriaName}</strong>
                    <p>{criterion.description}</p>
                  </div>
                  <div className="report-breakdown-metrics">
                    <span>Score: {criterion.scoreValue ?? "-"}</span>
                    <span>Weighted: {criterion.weightedScore ?? "-"}</span>
                    <span>{criterion.weightPercentage ?? 0}% weight</span>
                  </div>
                  {criterion.reviewComments && <p className="report-mini-note">{criterion.reviewComments}</p>}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="judge-section-box report-ai-box">
          <h4>AI Context</h4>
          <p><b>AI Score:</b> {application?.aiScore ?? "-"}</p>
          <p><b>AI Remarks:</b> {application?.aiRemarks || "N/A"}</p>
        </section>

        <section className="judge-section-box judge-manual-box">
          <h4>Finalize Decision</h4>
          <label className="field-label" htmlFor="judge-decision-select">Decision</label>
          <select
            id="judge-decision-select"
            className="judge-input"
            value={finalDecision}
            onChange={(event) => setFinalDecision(event.target.value)}
            disabled={isJudged || submitting}
          >
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CONDITIONAL">CONDITIONAL</option>
          </select>

          <label className="field-label" htmlFor="judge-score-input">Judge Score</label>
          <input
            id="judge-score-input"
            type="number"
            min="0"
            max="100"
            step="1"
            className="judge-input"
            value={finalScore}
            onChange={(event) => setFinalScore(event.target.value)}
            disabled={isJudged || submitting}
            placeholder="Enter final score"
          />

          <label className="field-label" htmlFor="judge-remarks-input">Remarks</label>
          <textarea
            id="judge-remarks-input"
            className="judge-textarea"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            disabled={isJudged || submitting}
            placeholder="Add the final decision remarks"
          />
        </section>

        {isJudged && <p className="lock-note workspace-complete-note">Judging has already been completed for this application.</p>}

        <div className="judge-actions-row workspace-footer-actions">
          <button className="action-btn action-view" onClick={() => navigate("/judge-dashboard")}>Back to Dashboard</button>
          <button className="action-btn action-judge" onClick={handleCompleteJudging} disabled={isJudged || submitting}>
            {submitting ? "Saving..." : "Finalize Decision"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Judge;
