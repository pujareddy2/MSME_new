import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getApplications } from "../services/api";
import "./judging.css";

function JudgeDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(location.state?.toast || "");

  const currentRole = localStorage.getItem("role");
  const isAllowed = currentRole === "JUDGE";

  const normalizeSubmission = useCallback((app) => {
    const aiScore = app?.aiScore ?? null;
    const judgeScore = app?.judgeScore ?? null;
    const statusText = (app?.submissionStatus || "").toLowerCase();
    const isEligibleForJudge = statusText === "evaluated" || statusText === "judged";

    const submissionId = app?.applicationId || app?.id;
    const teamName = app?.team?.teamName || "N/A";
    const problemId = app?.problem?.problemId || app?.problem?.id || "N/A";

    return {
      id: submissionId,
      teamName,
      teamId: app?.team?.teamId || app?.teamId || null,
      leader: app?.team?.leader?.fullName || "N/A",
      problemId,
      problemStatement: app?.problem?.problemTitle || app?.problem?.title || "N/A",
      abstract: app?.abstractText || "",
      aiScore,
      judgeScore,
      finalScore: aiScore !== null && judgeScore !== null
        ? Math.round((aiScore * 0.3 + judgeScore * 0.7) * 100) / 100
        : null,
      remarks: app?.manualRemarks || "",
      judgedBy: app?.judgedBy || "",
      timestamp: app?.evaluatedAt || app?.timestamp || null,
      status: isEligibleForJudge ? (judgeScore === null ? "Not Justified" : "Justified") : "SUBMITTED",
      canJudge: isEligibleForJudge,
    };
  }, []);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getApplications();
      const rows = (response.data || []).map(normalizeSubmission);
      setSubmissions(rows);
    } catch (error) {
      console.error(error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [normalizeSubmission]);

  useEffect(() => {
    loadApplications();

    const refreshTimer = setInterval(() => {
      loadApplications();
    }, 30000);

    return () => clearInterval(refreshTimer);
  }, [loadApplications]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setToastMessage("");
      navigate(location.pathname, { replace: true, state: {} });
    }, 2800);

    return () => clearTimeout(timer);
  }, [toastMessage, navigate, location.pathname]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => submission.canJudge);
  }, [submissions]);

  if (!isAllowed) {
    return <p style={{ padding: "80px" }}>Access restricted</p>;
  }

  return (
    <div className="judging-dashboard-container">
      <div className="judging-dashboard-head">
        <div className="judging-title-block">
          <h2 className="judging-page-title">Judge Dashboard</h2>
          <p className="judging-page-subtitle">Review evaluated submissions and justify with judge score.</p>
        </div>

        <div className="judging-toolbar">
          <button type="button" className="judging-refresh-btn" onClick={loadApplications}>
            Refresh
          </button>
        </div>
      </div>

      {toastMessage && <div className="judging-toast">{toastMessage}</div>}

      <div className="judging-table-shell">
        <div className="judging-table-wrap">
          <table className="judging-table">
            <thead>
              <tr>
                <th>Problem ID</th>
                <th>Team Name</th>
                <th>Problem Statement</th>
                <th>AI Score</th>
                <th>Judge Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading submissions...</td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7">No submissions available for this filter.</td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => {
                  return (
                    <tr key={submission.id}>
                      <td>{submission.problemId}</td>
                      <td>{submission.teamName}</td>
                      <td>{submission.problemStatement}</td>
                      <td className="score-ai">{submission.aiScore ?? "-"}</td>
                      <td className="score-manual">{submission.judgeScore ?? "-"}</td>
                      <td>
                        <span className={`status-badge ${submission.judgeScore === null ? "status-not-justified" : "status-justified"}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="judging-actions-cell">
                        {submission.judgeScore === null ? (
                          <button
                            className="action-btn action-judge"
                            onClick={() => navigate(`/feedback/${submission.id}`)}
                          >
                            Evaluate
                          </button>
                        ) : (
                          <button
                            className="action-btn action-report"
                            onClick={() => navigate(`/judge/report/${submission.id}`)}
                          >
                            View Report
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
    </div>
  );
}

export default JudgeDashboard;
