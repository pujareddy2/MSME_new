import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvaluationReportCompat, unwrapApiData } from "../services/api";
import "./judging.css";

function EvaluationReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const response = await getEvaluationReportCompat(Number(id));
        if (!cancelled) {
          setReport(unwrapApiData(response));
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const aiRows = useMemo(() => Object.entries(report?.aiScores || {}), [report]);
  const humanRows = useMemo(() => Object.entries(report?.humanScores || {}), [report]);
  const appliedAt = report?.appliedAt ? new Date(report.appliedAt).toLocaleString() : "N/A";

  if (loading) return <p className="workspace-loading">Loading report...</p>;
  if (!report) return <p className="workspace-loading">Report not found.</p>;

  return (
    <div className="judge-page-wrap report-page-wrap">
      <div className="judge-card judge-report-card report-card-shell report-single-column">
        <div className="workspace-header">
          <div>
            <p className="workspace-eyebrow">Evaluation Report</p>
            <h2 className="judge-card-title">Auto-Generated Evaluation Report</h2>
            <p className="workspace-subtitle">Applied submission, AI review, human review, and final scoring in one place.</p>
          </div>
          <span className="status-badge status-judged">{report.evaluationStatus || "COMPLETED"}</span>
        </div>

        <div className="report-stack">
          <section className="judge-section-box report-hero-box">
            <h4>Applied Submission</h4>
            <p><b>Problem ID:</b> {report.problemId}</p>
            <p><b>Problem Title:</b> {report.problemTitle}</p>
            <p><b>Problem Status:</b> {report.problemStatus || "ACTIVE"}</p>
            <p><b>Problem Statement:</b> {report.problemStatement || report.abstractText || "N/A"}</p>
            <p><b>Application Status:</b> {report.applicationStatus || "SUBMITTED"}</p>
            <p><b>Applied At:</b> {appliedAt}</p>
            <p><b>Team ID:</b> {report.teamId}</p>
            <p><b>Team Name:</b> {report.teamName}</p>
            <p><b>Abstract:</b> {report.abstractText || "N/A"}</p>
            <p><b>PPT Link:</b> {report.pptLink}</p>
            <p><b>GitHub Repo:</b> {report.githubLink || "N/A"}</p>
            <p><b>Project Demo Link:</b> {report.demoLink || "N/A"}</p>
          </section>

          <section className="judge-section-box report-ai-box">
            <h4>AI Evaluation</h4>
            <div className="report-breakdown-list">
              {aiRows.map(([k, v]) => (
                <article key={k} className="report-breakdown-card">
                  <strong>{k}</strong>
                  <p>Score: {v}/10</p>
                </article>
              ))}
            </div>
            <p><b>AI Total:</b> {report.aiTotalScore}/10</p>
            <p><b>AI Remarks:</b> {report.aiRemark || "N/A"}</p>
          </section>

          <section className="judge-section-box report-review-box">
            <h4>Human Evaluation</h4>
            <div className="report-breakdown-list">
              {humanRows.map(([k, v]) => (
                <article key={k} className="report-breakdown-card">
                  <strong>{k}</strong>
                  <p>Validated score: {v}/10</p>
                </article>
              ))}
            </div>
            <p><b>Human Total:</b> {report.humanTotalScore}/10</p>
            <p><b>Human Remarks:</b> {report.humanRemark || "N/A"}</p>
          </section>

          <section className="judge-section-box judge-score-box">
            <h4>Final Score</h4>
            <p><b>Final Score:</b> {report.totalScore}/100</p>
            <p><b>Normalized Score:</b> {report.normalizedScore ?? report.totalScore}/100</p>
            <p><b>Decision:</b> {report.finalDecision || "PENDING"}</p>
          </section>
        </div>

        <div className="judge-actions-row">
          <button className="action-btn action-view" onClick={() => navigate("/evaluator")}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default EvaluationReport;
