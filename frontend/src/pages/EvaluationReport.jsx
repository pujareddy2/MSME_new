import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvaluationReport, unwrapApiData } from "../services/api";
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
        const response = await getEvaluationReport(Number(id));
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

  if (loading) return <p className="workspace-loading">Loading report...</p>;
  if (!report) return <p className="workspace-loading">Report not found.</p>;

  return (
    <div className="judge-page-wrap report-page-wrap">
      <div className="judge-card judge-report-card report-card-shell">
        <div className="workspace-header">
          <div>
            <p className="workspace-eyebrow">Evaluation Report</p>
            <h2 className="judge-card-title">Auto-Generated Evaluation Report</h2>
          </div>
          <span className="status-badge status-judged">{report.evaluationStatus || "COMPLETED"}</span>
        </div>

        <section className="judge-section-box report-hero-box">
          <p><b>Problem ID:</b> {report.problemId}</p>
          <p><b>Problem Title:</b> {report.problemTitle}</p>
          <p><b>Team ID:</b> {report.teamId}</p>
          <p><b>Team Name:</b> {report.teamName}</p>
          <p><b>Abstract:</b> {report.abstractText || "N/A"}</p>
          <p><b>PPT Link:</b> {report.pptLink}</p>
          <p><b>GitHub Repo:</b> {report.githubLink || "N/A"}</p>
          <p><b>Project Demo Link:</b> {report.demoLink || "N/A"}</p>
        </section>

        <section className="judge-section-box report-ai-box">
          <h4>AI Evaluation</h4>
          {aiRows.map(([k, v]) => <p key={k}><b>{k}:</b> {v}/10</p>)}
          <p><b>AI Total:</b> {report.aiTotalScore}/10</p>
          <p><b>AI Remarks:</b> {report.aiRemark || "N/A"}</p>
        </section>

        <section className="judge-section-box report-review-box">
          <h4>Human Evaluation</h4>
          {humanRows.map(([k, v]) => <p key={k}><b>{k}:</b> {v}/10</p>)}
          <p><b>Human Total:</b> {report.humanTotalScore}/10</p>
          <p><b>Human Remarks:</b> {report.humanRemark || "N/A"}</p>
        </section>

        <section className="judge-section-box judge-score-box">
          <h4>Final Score</h4>
          <p><b>Final Score:</b> {report.totalScore}/100</p>
        </section>

        <div className="judge-actions-row">
          <button className="action-btn action-view" onClick={() => navigate("/evaluator")}>Back to Dashboard</button>
          <button className="action-btn action-report" onClick={() => navigate("/judge-dashboard")}>Open Judge Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default EvaluationReport;
