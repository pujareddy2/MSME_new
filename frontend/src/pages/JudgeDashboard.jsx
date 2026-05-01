import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJudgeEvaluations, getJudgeReports, justifyJudgeDecision, unwrapApiData } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./judging.css";

const JUDGE_CRITERIA = ["Innovation", "Technical Quality", "Feasibility", "Impact", "Completeness"];

function JudgeDashboard() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [rows, setRows] = useState([]);
  const [judgeReports, setJudgeReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [judgeScores, setJudgeScores] = useState({});
  const [judgeRemark, setJudgeRemark] = useState("");
  const [saving, setSaving] = useState(false);
  const currentRole = localStorage.getItem("role");
  const isAllowed = currentRole === "JUDGE" || currentRole === "ADMIN";

  const loadData = async () => {
    setLoading(true);
    try {
      const [evalRes, reportRes] = await Promise.all([getJudgeEvaluations(), getJudgeReports()]);
      setRows(unwrapApiData(evalRes) || []);
      setJudgeReports(unwrapApiData(reportRes) || []);
    } catch (error) {
      console.error(error);
      setRows([]);
      setJudgeReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0)),
    [rows]
  );

  const judgeTotal = useMemo(
    () => JUDGE_CRITERIA.reduce((sum, key) => sum + Number(judgeScores[key] || 0), 0),
    [judgeScores]
  );

  const openJustify = (row) => {
    setActiveReport(row);
    setShowSubmission(false);
    const initial = {};
    JUDGE_CRITERIA.forEach((name) => {
      initial[name] = row?.judgeScores?.[name] ?? "";
    });
    setJudgeScores(initial);
    setJudgeRemark(row?.judgeRemarks || "");
  };

  const saveJustification = async () => {
    if (!activeReport?.submissionId || !currentUser?.userId) return;
    for (const key of JUDGE_CRITERIA) {
      const value = Number(judgeScores[key]);
      if (Number.isNaN(value) || value < 0 || value > 10) {
        alert(`Enter a valid 0-10 score for ${key}.`);
        return;
      }
    }
    if (!judgeRemark.trim()) {
      alert("Judge remark is required.");
      return;
    }
    try {
      setSaving(true);
      await justifyJudgeDecision({
        submissionId: activeReport.submissionId,
        judgeUserId: currentUser.userId,
        judgeScores: Object.fromEntries(JUDGE_CRITERIA.map((k) => [k, Number(judgeScores[k])])), 
        judgeRemark: judgeRemark.trim(),
      });
      setActiveReport(null);
      await loadData();
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to justify submission.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAllowed) return <p style={{ padding: "80px" }}>Access restricted</p>;

  return (
    <div className="judging-dashboard-container judge-dashboard-container">
      <div className="ps-top-box">
        <h2 className="judging-page-title" style={{ marginBottom: 8 }}>Judge Dashboard</h2>
        <p className="judging-page-subtitle" style={{ marginTop: 0 }}>
          Final review workspace with evaluator and AI evidence, justification, and report generation.
        </p>
        <div className="judging-toolbar" style={{ marginTop: 10 }}>
          <button type="button" className="judging-refresh-btn" onClick={() => navigate("/problem-analysis")}>View Analysis</button>
        </div>
      </div>

      <div className="judging-table-shell">
        <div className="judging-table-wrap">
          <table className="judging-table judge-table">
            <thead>
              <tr>
                <th>Problem ID</th>
                <th>Problem Statement</th>
                <th>Status</th>
                <th>Team</th>
                <th>Final Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading evaluations...</td></tr>
              ) : sortedRows.length === 0 ? (
                <tr><td colSpan="6">No evaluated submissions available.</td></tr>
              ) : (
                sortedRows.map((row) => {
                  const status = (row.applicationStatus || "EVALUATED").toUpperCase();
                  const statusClass = status === "JUSTIFIED" ? "status-justified" : "status-pending";
                  return (
                    <tr key={row.submissionId}>
                      <td>{row.problemId}</td>
                      <td>
                        <div className="table-title-stack">
                          <strong>{row.problemTitle}</strong>
                          <span>{row.problemStatement || "No problem statement provided."}</span>
                        </div>
                      </td>
                      <td><span className={`status-badge ${statusClass}`}>{status}</span></td>
                      <td>
                        <div className="table-title-stack">
                          <strong>{row.teamName}</strong>
                          <span>Team ID: {row.teamId}</span>
                        </div>
                      </td>
                      <td className="score-manual"><strong>{row.judgeScore ?? row.totalScore ?? 0}</strong></td>
                      <td className="judging-actions-cell">
                        <button className="action-btn action-report" onClick={() => navigate(`/evaluation-report/${row.submissionId}`)}>
                          View Eval Report
                        </button>
                        {status === "JUSTIFIED" ? (
                          <button className="action-btn action-report" onClick={() => navigate(`/judge/report/${row.submissionId}`)}>
                            View Judge Report
                          </button>
                        ) : (
                          <button className="action-btn action-judge" onClick={() => openJustify(row)}>
                            Justify
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeReport && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="justify-modal-title">
          <div className="problem-modal judge-justify-modal">
            <div className="modal-head">
              <div>
                <p className="modal-eyebrow">Judge Justification</p>
                <h3 id="justify-modal-title">Justify Submission Review</h3>
              </div>
              <button type="button" className="icon-close-btn" onClick={() => setActiveReport(null)} aria-label="Close justify report">x</button>
            </div>

            <section className="judge-section-box">
              <p><b>Problem ID:</b> {activeReport.problemId}</p>
              <p><b>Problem Title:</b> {activeReport.problemTitle}</p>
              <p><b>Team Name:</b> {activeReport.teamName}</p>
              <button type="button" className="action-btn action-view" onClick={() => setShowSubmission((prev) => !prev)}>
                View Submission
              </button>
            </section>

            {showSubmission && (
              <section className="judge-section-box">
                <p><b>Problem ID:</b> {activeReport.problemId}</p>
                <p><b>Problem Statement:</b> {activeReport.problemStatement || "N/A"}</p>
                <p><b>Team Name:</b> {activeReport.teamName}</p>
                <p><b>Team Leader Name:</b> {activeReport.teamLeaderName || "N/A"}</p>
                <p><b>Team Members:</b> {(activeReport.teamMembers || []).join(", ") || "N/A"}</p>
                <p><b>Abstract:</b> {activeReport.abstractText || "N/A"}</p>
                <p><b>GitHub Repo Link:</b> {activeReport.githubLink || "N/A"}</p>
                <p><b>PPT Link:</b> {activeReport.pptLink || "N/A"}</p>
                <p><b>Demo Link:</b> {activeReport.demoLink || "N/A"}</p>
              </section>
            )}

            <section className="judge-section-box">
              <h4>AI Evaluation</h4>
              {(activeReport.aiScores ? Object.entries(activeReport.aiScores) : []).map(([key, value]) => (
                <p key={key}><b>{key}:</b> {value}/10</p>
              ))}
              <p><b>AI Remarks:</b> {activeReport.aiRemark || "N/A"}</p>
            </section>

            <section className="judge-section-box">
              <h4>Human Evaluation</h4>
              {(activeReport.humanScores ? Object.entries(activeReport.humanScores) : []).map(([key, value]) => (
                <p key={key}><b>{key}:</b> {value}/10</p>
              ))}
              <p><b>Human Remarks:</b> {activeReport.humanRemark || "N/A"}</p>
            </section>

            <section className="judge-section-box judge-score-box">
              <h4>Judge Validation + Scoring</h4>
              {JUDGE_CRITERIA.map((criterion) => (
                <div key={criterion}>
                  <label className="field-label">{criterion}</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="judge-input"
                    value={judgeScores[criterion]}
                    onChange={(e) => setJudgeScores((prev) => ({ ...prev, [criterion]: e.target.value }))}
                  />
                </div>
              ))}
              <p><b>Auto Total:</b> {judgeTotal}/50</p>
              <label className="field-label">Judge Remark</label>
              <textarea className="judge-textarea" value={judgeRemark} onChange={(e) => setJudgeRemark(e.target.value)} />
            </section>

            <div className="modal-footer">
              <button type="button" className="action-btn action-judge" onClick={saveJustification} disabled={saving}>
                {saving ? "Saving..." : "Justified"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JudgeDashboard;
