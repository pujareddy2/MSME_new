import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById, getSubmissionViewUrl } from "../services/api";
import "./judging.css";

function JudgeReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplicationById(id)
      .then((response) => setApplication(response.data))
      .catch(() => setApplication(null))
      .finally(() => setLoading(false));
  }, [id]);

  const finalScore = useMemo(() => {
    const ai = application?.aiScore;
    const judgeScore = application?.judgeScore;

    if (ai === null || ai === undefined || judgeScore === null || judgeScore === undefined) {
      return null;
    }

    return Math.round((ai * 0.3 + judgeScore * 0.7) * 100) / 100;
  }, [application]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading report...</p>;
  }

  if (!application) {
    return <p style={{ padding: "40px" }}>Report not found.</p>;
  }

  return (
    <div className="judge-page-wrap">
      <div className="judge-card judge-report-card">
        <h2 className="judge-card-title">Judge Report</h2>

        <section className="judge-section-box">
          <h4>Section 1: Team Details</h4>
          <p><b>Team Name:</b> {application.team?.teamName || "N/A"}</p>
          <p><b>Leader:</b> {application.team?.leader?.fullName || "N/A"}</p>
          <p><b>Team ID:</b> {application.team?.teamId || application.teamId || "N/A"}</p>
        </section>

        <section className="judge-section-box">
          <h4>Section 2: Problem Details</h4>
          <p><b>Problem ID:</b> {application.problem?.problemId || application.problem?.id || "N/A"}</p>
          <p><b>Problem Statement:</b> {application.problem?.problemTitle || application.problem?.title || "N/A"}</p>
          <p><b>Abstract:</b> {application.abstractText || "N/A"}</p>
        </section>

        <section className="judge-section-box">
          <h4>Section 3: Submission Assets</h4>
          <button
            type="button"
            className="action-btn action-view"
            onClick={() => window.open(getSubmissionViewUrl(application.applicationId || application.id), "_blank")}
          >
            View Submission
          </button>
        </section>

        <section className="judge-section-box report-score-grid">
          <h4>Section 4: Evaluation and Judging Details</h4>
          <p><b>AI Score:</b> <span className="score-ai">{application.aiScore ?? "-"}</span></p>
          <p><b>AI Remarks:</b> {application.aiRemarks || "N/A"}</p>
          <p><b>Judge Score:</b> <span className="score-manual">{application.judgeScore ?? "-"}</span></p>
          <p><b>Manual Remarks:</b> {application.manualRemarks || "N/A"}</p>
          <p><b>Final Score:</b> {finalScore ?? "-"}</p>
          <p><b>Status:</b> {application.submissionStatus || "N/A"}</p>
          <p><b>Judged By:</b> {application.judgedBy || "N/A"}</p>
          <p><b>Timestamp:</b> {application.evaluatedAt || application.timestamp || "N/A"}</p>
        </section>

        <div className="judge-actions-row">
          <button className="action-btn action-view" onClick={() => navigate("/judge-dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default JudgeReport;
