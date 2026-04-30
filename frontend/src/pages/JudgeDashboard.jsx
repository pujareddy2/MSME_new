import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJudgeEvaluations, unwrapApiData } from "../services/api";
import "./judging.css";

function JudgeDashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentRole = localStorage.getItem("role");
  const isAllowed = currentRole === "JUDGE" || currentRole === "ADMIN";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const response = await getJudgeEvaluations();
        if (!cancelled) {
          const data = unwrapApiData(response) || [];
          setRows(data);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0)),
    [rows]
  );

  if (!isAllowed) return <p style={{ padding: "80px" }}>Access restricted</p>;

  return (
    <div className="judging-dashboard-container judge-dashboard-container">
      <div className="ps-top-box">
        <h2 className="judging-page-title" style={{ marginBottom: 8 }}>Judge Dashboard</h2>
        <p className="judging-page-subtitle" style={{ marginTop: 0 }}>
          Final review workspace with exact evaluator report data, sorted by score for decision support.
        </p>
      </div>

      <div className="judging-table-shell">
        <div className="judging-table-wrap">
          <table className="judging-table judge-table">
            <thead>
              <tr>
                <th>Problem ID</th>
                <th>Problem Title</th>
                <th>Team</th>
                <th>Submission Data</th>
                <th>Evaluation Data</th>
                <th>Final Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Loading evaluations...</td></tr>
              ) : sortedRows.length === 0 ? (
                <tr><td colSpan="7">No evaluated submissions available.</td></tr>
              ) : (
                sortedRows.map((row) => {
                    const judgeStatus = (row.finalDecision || "PENDING") === "PENDING" ? "Pending" : "Reviewed";
                    const judgeStatusClass = judgeStatus === "Pending" ? "status-pending" : "status-judged";
                    return (
                  <tr key={row.submissionId}>
                    <td>{row.problemId}</td>
                    <td>{row.problemTitle}</td>
                    <td>
                      <div className="table-title-stack">
                        <strong>{row.teamName}</strong>
                        <span>Team ID: {row.teamId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-stack">
                        <span>{row.abstractText ? `${row.abstractText.slice(0, 80)}...` : "N/A"}</span>
                        <span>PPT: {row.pptLink || "N/A"}</span>
                        <span>GitHub: {row.githubLink || "N/A"}</span>
                        <span>Demo: {row.demoLink || "N/A"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-stack">
                        <span>AI: {row.aiTotalScore || 0}/10</span>
                        <span>Human: {row.humanTotalScore || 0}/10</span>
                        <span>
                          Judge Status:
                          {" "}
                          <span className={`status-badge ${judgeStatusClass}`}>{judgeStatus}</span>
                        </span>
                      </div>
                    </td>
                    <td className="score-manual"><strong>{row.totalScore || 0}</strong></td>
                    <td className="judging-actions-cell">
                      <button className="action-btn action-report" onClick={() => navigate(`/evaluation-report/${row.submissionId}`)}>
                        View Report
                      </button>
                      <button className="action-btn action-judge" onClick={() => navigate(`/feedback/${row.submissionId}`)}>
                        {judgeStatus === "Pending" ? "Finalize" : "Completed"}
                      </button>
                    </td>
                  </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JudgeDashboard;
