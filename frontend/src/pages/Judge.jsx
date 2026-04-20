import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById, getSubmissionViewUrl, submitJudging } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./judging.css";

function Judge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [judgeScoreInput, setJudgeScoreInput] = useState("");

  useEffect(() => {
    getApplicationById(id)
      .then((response) => {
        const app = response.data;
        setApplication(app);
        setJudgeScoreInput(app?.judgeScore !== null && app?.judgeScore !== undefined ? String(app.judgeScore) : "");
      })
      .catch(() => setApplication(null))
      .finally(() => setLoading(false));
  }, [id]);

  const status = useMemo(() => {
    return (application?.submissionStatus || "").toLowerCase();
  }, [application]);

  const isEvaluated = useMemo(() => {
    return status === "evaluated" || status === "judged";
  }, [status]);

  const hasJudgeScore = useMemo(() => {
    return application?.judgeScore !== null && application?.judgeScore !== undefined;
  }, [application]);

  const finalScore = useMemo(() => {
    const ai = application?.aiScore;
    const judgeScore = application?.judgeScore;
    if (ai === null || ai === undefined || judgeScore === null || judgeScore === undefined) {
      return null;
    }
    return Math.round((ai * 0.3 + judgeScore * 0.7) * 100) / 100;
  }, [application]);

  useEffect(() => {
    if (!loading && hasJudgeScore) {
      alert("Judging has already been completed for this application.");
    }
  }, [loading, hasJudgeScore]);

  const handleCompleteJudging = async () => {
    const scoreValue = judgeScoreInput.trim();
    if (!scoreValue) {
      alert("Please enter judge score.");
      return;
    }

    if (!/^\d+(\.\d+)?$/.test(scoreValue)) {
      alert("Judge score must be a valid number.");
      return;
    }

    const numericScore = Number(scoreValue);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      alert("Judge score must be between 0 and 100.");
      return;
    }

    const status = (application?.submissionStatus || "").toLowerCase();
    if (status === "judged" && hasJudgeScore) {
      alert("This application has already been judged.");
      return;
    }

    if (status !== "evaluated" && status !== "judged") {
      alert("Only evaluated applications can be judged.");
      return;
    }

    if (!window.confirm("Complete final judging for this application?")) {
      return;
    }

    try {
      setSubmitting(true);
      await submitJudging(id, {
        manualScore: Math.round(numericScore),
        judgedBy: user?.name || user?.email || "Judge",
        timestamp: new Date().toISOString(),
      });

      navigate("/judge-dashboard", {
        state: { toast: "Judging completed successfully" },
      });
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to submit judging.";

      alert(typeof backendMessage === "string" ? backendMessage : "Unable to submit judging.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading application...</p>;
  }

  if (!application) {
    return <p style={{ padding: "40px" }}>Application not found.</p>;
  }

  return (
    <div className="judge-page-wrap">
      <div className="judge-card">
        <h2 className="judge-card-title">Feedback Page</h2>

        <div className="judge-meta-grid">
          <div>
            <p className="meta-label">Team Name</p>
            <p className="meta-value">{application.team?.teamName || "N/A"}</p>
          </div>
          <div>
            <p className="meta-label">Problem ID</p>
            <p className="meta-value">{application.problem?.problemId || application.problem?.id || "N/A"}</p>
          </div>
        </div>

        <div className="judge-section-box">
          <h4>Problem Statement</h4>
          <p>{application.problem?.problemTitle || application.problem?.title || "N/A"}</p>
        </div>

        <div className="judge-section-box">
          <h4>Abstract</h4>
          <p>{application.abstractText || "N/A"}</p>
        </div>

        <div className="judge-section-box">
          <h4>PPT Submission</h4>
          <div className="ppt-actions-row">
            <button
              type="button"
              className="action-btn action-view"
              onClick={() => window.open(getSubmissionViewUrl(application.applicationId || application.id), "_blank")}
            >
              View Submission
            </button>
          </div>
          <iframe
            title="submission-preview"
            src={getSubmissionViewUrl(application.applicationId || application.id)}
            className="ppt-frame"
          />
        </div>

        <div className="judge-section-box judge-score-box">
          <h4>Evaluator Output</h4>
          <p><b>AI Score:</b> {application.aiScore ?? "-"}</p>
          <p><b>AI Remarks:</b> {application.aiRemarks || "-"}</p>
          <p><b>Judge Score:</b> {application.judgeScore ?? "-"}</p>
          <p><b>Manual Remarks:</b> {application.manualRemarks || "-"}</p>
          <p><b>Final Score:</b> {finalScore ?? "-"}</p>
          <p><b>Status:</b> {application?.judgeScore === null || application?.judgeScore === undefined ? "Not Justified" : "Justified"}</p>
          <p><b>Judged By:</b> {application.judgedBy || "N/A"}</p>
        </div>

        <div className="judge-section-box judge-manual-box">
          <h4>Judge Score Input</h4>
          <label htmlFor="judge-score-input" className="meta-label">Enter Judge Score</label>
          <input
            id="judge-score-input"
            type="number"
            min="0"
            max="100"
            step="1"
            className="judge-input"
            value={judgeScoreInput}
            onChange={(event) => setJudgeScoreInput(event.target.value)}
            placeholder="Enter Judge Score"
          />
          <button
            type="button"
            className="action-btn action-judge"
            onClick={handleCompleteJudging}
            disabled={!isEvaluated || hasJudgeScore || submitting}
            style={{ marginTop: 12 }}
          >
            {submitting ? "Saving..." : "Save Score"}
          </button>
        </div>

        {!isEvaluated && <p className="lock-note">This application is not evaluated yet. Judge stage is enabled only after evaluator submission.</p>}
        {hasJudgeScore && <p className="lock-note">Judging is already completed for this application.</p>}

        <div className="judge-actions-row">
          <button className="action-btn action-view" onClick={() => navigate("/judge-dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default Judge;
