import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications, getProblems } from "../services/api";
import "./judging.css";

function EvaluatorDashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const currentRole = localStorage.getItem("role");
  const isAllowed = currentRole === "EVALUATOR" || currentRole === "ADMIN";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [appsRes, problemsRes] = await Promise.all([getApplications(), getProblems()]);
        if (cancelled) return;

        const apps = Array.isArray(appsRes?.data) ? appsRes.data : [];
        const problems = Array.isArray(problemsRes?.data) ? problemsRes.data : [];
        const problemMap = new Map(problems.map((p) => [String(p.problemId), p]));

        const normalized = apps.map((app) => {
          const submissionId = app.applicationId || app.id;
          const problemId = app.problem?.problemId || app.problemId;
          const problem = problemMap.get(String(problemId)) || app.problem || {};
          const status = (app.submissionStatus || "SUBMITTED").toUpperCase();
          return {
            submissionId,
            problemId: problem.customProblemId || problem.problemId || problemId,
            problemTitle: problem.problemTitle || "N/A",
            teamId: app.team?.teamId || app.teamId,
            teamName: app.team?.teamName || "N/A",
            totalSubmissions: 0,
            evaluatedCount: 0,
            pendingCount: 0,
            status,
            isEvaluated: status === "EVALUATED" || status === "JUDGED" || status === "JUSTIFIED",
          };
        });

        const byProblem = normalized.reduce((acc, row) => {
          const key = String(row.problemId);
          acc[key] = acc[key] || { total: 0, evaluated: 0 };
          acc[key].total += 1;
          if (row.isEvaluated) acc[key].evaluated += 1;
          return acc;
        }, {});

        const enriched = normalized.map((row) => {
          const stats = byProblem[String(row.problemId)] || { total: 0, evaluated: 0 };
          return {
            ...row,
            totalSubmissions: stats.total,
            evaluatedCount: stats.evaluated,
            pendingCount: stats.total - stats.evaluated,
          };
        });
        setRows(enriched);
      } catch (error) {
        console.error(error);
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "pending") return rows.filter((r) => !r.isEvaluated);
    if (filter === "evaluated") return rows.filter((r) => r.isEvaluated);
    return rows;
  }, [rows, filter]);

  if (!isAllowed) return <p style={{ padding: "80px" }}>Evaluator access only.</p>;

  return (
    <div className="judging-dashboard-container evaluator-dashboard-container">
      <div className="ps-top-box">
        <h2 className="judging-page-title" style={{ marginBottom: 8 }}>Evaluator Dashboard</h2>
        <p className="judging-page-subtitle" style={{ marginTop: 0 }}>
          AI + Human evaluation workflow with instant report generation and judge-ready publishing.
        </p>
        <div className="judging-toolbar">
          <select className="judging-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="evaluated">Evaluated</option>
          </select>
          <button type="button" className="judging-refresh-btn" onClick={() => navigate("/problem-analysis")}>View Analysis</button>
          <button type="button" className="judging-refresh-btn" onClick={() => navigate("/evaluator")}>Refresh View</button>
        </div>
      </div>

      <div className="judging-table-shell">
        <div className="judging-table-wrap">
          <table className="judging-table evaluator-table">
            <thead>
              <tr>
                <th>Problem ID</th>
                <th>Problem Statement</th>
                <th>Team</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5">Loading submissions...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5">No submissions found.</td></tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.submissionId}>
                    <td>{row.problemId}</td>
                    <td>
                      <div className="table-title-stack">
                        <strong>{row.problemTitle}</strong>
                        <span>Submissions: {row.totalSubmissions}</span>
                        <span>Evaluated: {row.evaluatedCount}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-stack">
                        <strong>{row.teamName}</strong>
                        <span>Team ID: {row.teamId}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${row.isEvaluated ? "status-judged" : "status-pending"}`}>
                        {row.isEvaluated ? "Evaluated" : "Pending"}
                      </span>
                    </td>
                    <td className="judging-actions-cell">
                      <button
                        className={`action-btn ${row.isEvaluated ? "action-report" : "action-judge"}`}
                        onClick={() => navigate(row.isEvaluated ? `/evaluation-report/${row.submissionId}` : `/evaluate/${row.submissionId}`)}
                      >
                        {row.isEvaluated ? "View Report" : "Evaluate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EvaluatorDashboard;
