import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJudgeReportById, unwrapApiData } from "../services/api";
import "./judging.css";

function JudgeReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadReport() {
      try {
        setLoading(true);
        const response = await getJudgeReportById(id);
        if (!cancelled) setReport(unwrapApiData(response));
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadReport();
    return () => { cancelled = true; };
  }, [id]);

  const aiRows = useMemo(() => Object.entries(report?.aiScores || {}), [report]);
  const humanRows = useMemo(() => Object.entries(report?.humanScores || {}), [report]);
  const judgeRows = useMemo(() => Object.entries(report?.judgeScores || {}), [report]);

  if (loading) return <p className="workspace-loading">Loading report...</p>;
  if (!report) return <p className="workspace-loading">Report not found.</p>;

  return (
    <div className="judge-page-wrap report-page-wrap">
      <div className="judge-card judge-report-card report-card-shell report-single-column">
        <div className="workspace-header">
          <div>
            <p className="workspace-eyebrow">Judge Report</p>
            <h2 className="judge-card-title">Final Justification Report</h2>
          </div>
          <span className="status-badge status-justified">{report.applicationStatus || "JUSTIFIED"}</span>
        </div>
        <div className="report-stack">
          {/* SECTION 1: PROBLEM DETAILS */}
          <section className="judge-section-box">
            <h4>1. Problem Details</h4>
            <p><b>Problem ID:</b> {report.problemId}</p>
            <p><b>Problem Title:</b> {report.problemTitle}</p>
            <p><b>Theme:</b> {report.problemTheme || "N/A"}</p>
            <p><b>Description:</b> {report.problemStatement || "N/A"}</p>
          </section>

          {/* SECTION 2: SUBMISSION DETAILS (CLICKABLE) */}
          <section className="judge-section-box">
            <h4>2. Submission Details</h4>
            <div className="report-breakdown-card" style={{ marginBottom: '16px' }}>
              <p><b>Team ID:</b> {report.teamId || "N/A"}</p>
              <p><b>Team Name:</b> {report.teamName}</p>
              <p><b>Problem ID:</b> {report.problemId}</p>
              <p><b>Abstract:</b> {report.abstractText || "N/A"}</p>
            </div>
            
            <div className="team-links" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {report.githubLink && (
                <a href={report.githubLink} target="_blank" rel="noreferrer" style={{ background: '#24292e', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                  🔗 GitHub Repository
                </a>
              )}
              {report.pptLink && (
                <a href={report.pptLink} target="_blank" rel="noreferrer" style={{ background: '#d32f2f', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                  📊 PPT File
                </a>
              )}
              {report.demoLink && (
                <a href={report.demoLink} target="_blank" rel="noreferrer" style={{ background: '#0288d1', padding: '8px 16px', borderRadius: '4px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                  ▶️ Demo Link
                </a>
              )}
              {!report.githubLink && !report.pptLink && !report.demoLink && (
                <p>No project links provided.</p>
              )}
            </div>
          </section>

          {/* SECTION 3: EVALUATION REPORT */}
          <section className="judge-section-box">
            <h4>3. Evaluation Report</h4>
            
            <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h5 style={{ borderBottom: '1px solid #e0e8f0', paddingBottom: '8px', color: '#2f7f97' }}>AI Evaluation</h5>
                {aiRows.length > 0 ? (
                  aiRows.map(([key, val]) => <p key={`ai-${key}`}><b>{key}:</b> {val}/10</p>)
                ) : (
                  <p>No AI scores available.</p>
                )}
                <div style={{ marginTop: '12px', padding: '12px', background: '#f7fbfe', borderRadius: '6px' }}>
                  <p><b>AI Remarks:</b></p>
                  <p>{report.aiRemark || "N/A"}</p>
                </div>
              </div>
              
              <div>
                <h5 style={{ borderBottom: '1px solid #e0e8f0', paddingBottom: '8px', color: '#2f7f97' }}>Human Evaluation</h5>
                {humanRows.length > 0 ? (
                  humanRows.map(([key, val]) => <p key={`human-${key}`}><b>{key}:</b> {val}/10</p>)
                ) : (
                  <p>No human scores available.</p>
                )}
                <div style={{ marginTop: '12px', padding: '12px', background: '#f7fbfe', borderRadius: '6px' }}>
                  <p><b>Human Remarks:</b></p>
                  <p>{report.humanRemark || "N/A"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: JUSTIFICATION (JUDGE DATA) */}
          <section className="judge-section-box">
            <h4>4. Justification (Judge Data)</h4>
            <div style={{ background: '#fff9e6', padding: '16px', borderLeft: '4px solid #ffca28', borderRadius: '0 8px 8px 0' }}>
              <h5 style={{ marginTop: 0, color: '#f57f17' }}>Judge Evaluation</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                {judgeRows.length > 0 ? (
                  judgeRows.map(([key, val]) => <p key={`judge-${key}`} style={{ margin: 0 }}><b>{key}:</b> {val}/10</p>)
                ) : (
                  <p>No judge scores available.</p>
                )}
              </div>
              <p><b>Judge Remarks:</b></p>
              <p style={{ fontStyle: 'italic' }}>"{report.judgeRemarks || "N/A"}"</p>
            </div>
          </section>

          {/* SECTION 5: FINAL SCORE VALIDATION */}
          <section className="judge-section-box judge-score-box" style={{ background: '#e8f5e9', border: '1px solid #c8e6c9' }}>
            <h4 style={{ color: '#2e7d32' }}>5. Final Score Validation</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
              <div style={{ flex: 1, minWidth: '120px', textAlign: 'center', background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>AI Total</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#455a64' }}>{report.aiTotalScore ?? "N/A"}</div>
              </div>
              <div style={{ flex: 1, minWidth: '120px', textAlign: 'center', background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Human Total</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#455a64' }}>{report.humanTotalScore ?? "N/A"}</div>
              </div>
              <div style={{ flex: 1, minWidth: '120px', textAlign: 'center', background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Judge Total</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57f17' }}>{report.judgeScore ?? "N/A"}</div>
              </div>
              <div style={{ flex: 1, minWidth: '120px', textAlign: 'center', background: '#2e7d32', color: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(46,125,50,0.3)' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.9 }}>Final Validated Score</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{report.judgeScore ?? report.totalScore ?? 0} <span style={{ fontSize: '16px', opacity: 0.8 }}>/100</span></div>
              </div>
            </div>
          </section>
        </div>
        <div className="judge-actions-row">
          <button className="action-btn action-view" onClick={() => navigate("/judge-dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default JudgeReport;
