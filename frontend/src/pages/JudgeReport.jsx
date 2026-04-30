import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getApplicationById, getSubmissionDetails, unwrapApiData } from "../services/api";
import "./judging.css";

function JudgeReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(location.state?.submission || null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(!location.state?.submission);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);

        const [reportResponse, applicationResponse] = await Promise.all([
          getSubmissionDetails(id).catch(() => null),
          getApplicationById(id).catch(() => null),
        ]);

        if (cancelled) {
          return;
        }

        setReport(location.state?.submission || unwrapApiData(reportResponse));
        setApplication(unwrapApiData(applicationResponse));
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

    if (!location.state?.submission) {
      loadReport();
    } else {
      getApplicationById(id)
        .then((response) => setApplication(unwrapApiData(response)))
        .catch(() => setApplication(null))
        .finally(() => setLoading(false));
    }

    return () => {
      cancelled = true;
    };
  }, [id, location.state]);

  const status = useMemo(() => {
    return (report?.evaluationStatus || application?.evaluationStatus || application?.submissionStatus || "JUDGED").toUpperCase();
  }, [report, application]);

  const criteriaRows = report?.criteriaScores || [];
  const isJudged = status === "JUDGED";

  if (loading) {
    return <p className="workspace-loading">Loading report...</p>;
  }

  if (!report && !application) {
    return <p className="workspace-loading">Report not found.</p>;
  }

  return (
    <div className={`judge-page-wrap report-page-wrap ${isJudged ? "report-judged" : "report-evaluated"}`}>
      <div className="judge-card judge-report-card report-card-shell">
        <div className="workspace-header">
          <div>
            <p className="workspace-eyebrow">Judge Outcome</p>
            <h2 className="judge-card-title">Final Report</h2>
            <p className="workspace-subtitle">This page captures the evaluator review, AI context, and the judge’s final decision.</p>
          </div>

          <span className={`status-badge ${isJudged ? "status-judged" : "status-pending"}`}>{status}</span>
        </div>

        <div className="workspace-summary-grid">
          <article className="workspace-summary-card">
            <span>Final Decision</span>
            <strong>{report?.finalDecision || application?.decision || "PENDING"}</strong>
          </article>
          <article className="workspace-summary-card">
            <span>Judge Score</span>
            <strong>{report?.judgeScore ?? application?.judgeScore ?? "-"}</strong>
          </article>
          <article className="workspace-summary-card">
            <span>Evaluator Score</span>
            <strong>{report?.totalScore ?? report?.normalizedScore ?? "-"}</strong>
          </article>
          <article className="workspace-summary-card">
            <span>Team</span>
            <strong>{report?.teamName || application?.team?.teamName || "N/A"}</strong>
          </article>
        </div>

        <section className="judge-section-box report-hero-box">
          <div className="report-meta-grid">
            <div>
              <p className="meta-label">Problem</p>
              <p className="meta-value">{report?.problemTitle || application?.problem?.problemTitle || application?.problem?.title || "N/A"}</p>
            </div>
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
          </div>
        </section>

        <section className="judge-section-box report-score-grid report-breakdown-box">
          <h4>Evaluator Breakdown</h4>
          {criteriaRows.length === 0 ? (
            <p className="workspace-empty-state">No criterion scores were returned by the backend.</p>
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

        <section className="judge-section-box report-review-box">
          <h4>Judge Remarks</h4>
          <p>{report?.judgeRemarks || application?.judgeRemarks || "N/A"}</p>
        </section>

        <div className="judge-actions-row">
          <button className="action-btn action-view" onClick={() => navigate("/judge-dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default JudgeReport;
