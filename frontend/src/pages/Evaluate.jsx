import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById, getEvaluationReportCompat, getSubmissionViewUrl, runAiEvaluation, submitUnifiedEvaluationCompat, unwrapApiData } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./judging.css";

const criteriaList = [
  "Innovation",
  "Technical Implementation",
  "Problem Relevance",
  "Use of AI Tools",
  "Feasibility",
  "Scalability",
];

function Evaluate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [application, setApplication] = useState(null);
  const [aiScores, setAiScores] = useState({});
  const [aiRemark, setAiRemark] = useState("");
  const [humanScores, setHumanScores] = useState(Object.fromEntries(criteriaList.map((c) => [c, 0])));
  const [humanRemark, setHumanRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [runningAi, setRunningAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const appRes = await getApplicationById(id);
        const app = unwrapApiData(appRes);
        if (cancelled) return;
        setApplication(app);
        const status = (app?.submissionStatus || "").toUpperCase();
        if (status === "EVALUATED" || status === "JUDGED") {
          setAlreadyEvaluated(true);
          navigate(`/evaluation-report/${id}`);
          return;
        }
        await executeAiRun(id, cancelled);
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
  }, [id, navigate]);

  const executeAiRun = async (submissionId, cancelled = false) => {
    try {
      setRunningAi(true);
      const aiRes = await runAiEvaluation({ submissionId: Number(submissionId) });
      const ai = unwrapApiData(aiRes) || {};
      if (!cancelled) {
        setAiScores(ai.aiScores || {});
        setAiRemark(ai.aiRemark || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (!cancelled) setRunningAi(false);
    }
  };

  const aiTotal = useMemo(() => {
    const values = Object.values(aiScores || {});
    if (!values.length) return 0;
    return (values.reduce((a, b) => a + Number(b || 0), 0) / values.length).toFixed(2);
  }, [aiScores]);

  const humanTotal = useMemo(() => {
    const values = Object.values(humanScores || {});
    if (!values.length) return 0;
    return (values.reduce((a, b) => a + Number(b || 0), 0) / values.length).toFixed(2);
  }, [humanScores]);

  const finalScore = useMemo(() => {
    const ai = Number(aiTotal || 0);
    const human = Number(humanTotal || 0);
    return ((ai * 0.4) + (human * 0.6)).toFixed(2);
  }, [aiTotal, humanTotal]);

  const updateHuman = (criterion, value) => {
    const normalized = value.replace(/[^0-9.]/g, "");
    if (normalized === "") {
      setHumanScores((prev) => ({ ...prev, [criterion]: 0 }));
      return;
    }
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      return;
    }
    const safe = Math.max(0, Math.min(10, parsed));
    setHumanScores((prev) => ({ ...prev, [criterion]: Number(safe.toString()) }));
  };

  const handleSubmit = async () => {
    if (!currentUser?.userId) {
      navigate("/login");
      return;
    }

    const hasAiInput =
      Object.values(aiScores || {}).some((value) => Number(value || 0) > 0) ||
      (aiRemark || "").trim() !== "";
    const hasHumanInput =
      Object.values(humanScores || {}).some((value) => Number(value || 0) > 0) ||
      (humanRemark || "").trim() !== "";

    if (!hasAiInput && !hasHumanInput) {
      alert("Please provide at least one evaluation input (AI or Human) before submitting.");
      return;
    }
    try {
      setSubmitting(true);
      setSuccessMessage("");
      await submitUnifiedEvaluationCompat({
        submissionId: Number(id),
        evaluatorId: currentUser.userId,
        aiScores,
        aiRemark,
        humanScores,
        humanRemark: humanRemark.trim(),
      });
      setSuccessMessage("Evaluation submitted successfully.");
      let report = null;
      try {
        const reportRes = await getEvaluationReportCompat(Number(id));
        report = unwrapApiData(reportRes);
      } catch (reportError) {
        console.warn("Report refresh failed after submit", reportError);
      }
      navigate(`/evaluation-report/${id}`, { state: { report, toast: "Evaluation submitted successfully." } });
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to submit evaluation.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || alreadyEvaluated) return <p className="workspace-loading">Loading evaluation workspace...</p>;
  if (!application) return <p className="workspace-loading">Submission not found.</p>;

  return (
    <div className="judge-page-wrap evaluation-workspace-wrap">
      <div className="judge-card evaluation-workspace-card">
        <div className="workspace-header">
          <div>
            <p className="workspace-eyebrow">Evaluation</p>
            <h2 className="judge-card-title">AI + Human Evaluation</h2>
          </div>
        </div>

        <section className="judge-section-box report-hero-box">
          <div className="report-meta-grid">
            <div><p className="meta-label">Problem ID</p><p className="meta-value">{application.problem?.problemId}</p></div>
            <div><p className="meta-label">Problem Title</p><p className="meta-value">{application.problem?.problemTitle}</p></div>
            <div><p className="meta-label">Team ID</p><p className="meta-value">{application.team?.teamId}</p></div>
            <div><p className="meta-label">Team Name</p><p className="meta-value">{application.team?.teamName}</p></div>
          </div>
          <div className="submission-details-grid">
            <div className="submission-labels">
              <p><b>Abstract</b></p>
              <p><b>GitHub Repo</b></p>
              <p><b>PPT Link</b></p>
              <p><b>Demo Link</b></p>
            </div>
            <div className="submission-values">
              <div className="abstract-box">
                <p className={showFullAbstract ? "abstract-full" : "abstract-clamped"}>
                  {application.abstractText || "N/A"}
                </p>
                {application.abstractText && application.abstractText.length > 120 && (
                  <button type="button" className="secondary-btn" onClick={() => setShowFullAbstract((v) => !v)}>
                    {showFullAbstract ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
              <p>{application.githubLink ? <a href={application.githubLink} target="_blank" rel="noreferrer">{application.githubLink}</a> : "N/A"}</p>
              <p><a href={getSubmissionViewUrl(application.applicationId || application.id)} target="_blank" rel="noreferrer">Open Submission</a></p>
              <p>{application.demoLink ? <a href={application.demoLink} target="_blank" rel="noreferrer">{application.demoLink}</a> : "N/A"}</p>
            </div>
          </div>
        </section>

        <section className="judge-section-box report-ai-box">
          <h4 className="ai-heading-center">AI Evaluation</h4>
          <div className="ai-grid-rows">
            <div className="ai-row ai-criteria-row">
              {criteriaList.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <div className="ai-row ai-score-row">
              {criteriaList.map((c) => (
                <strong key={c}>{aiScores[c] ?? 0}</strong>
              ))}
            </div>
          </div>
          <p><b>AI Total:</b> {aiTotal}/10</p>
          <p><b>AI Remarks:</b> {aiRemark || "Awaiting AI evaluation..."}</p>
          <div style={{ marginTop: 10 }}>
            <button className="action-btn action-view" onClick={() => executeAiRun(id)} disabled={runningAi}>
              {runningAi ? "Running AI..." : "Run AI Evaluation"}
            </button>
          </div>
        </section>

        <section className="judge-section-box judge-manual-box">
          <h4>Human Evaluation</h4>
          <div className="judge-form-grid">
            {criteriaList.map((c) => (
              <div key={c}>
                <label className="field-label">{c} (0-10)</label>
                <input className="judge-input" type="number" min="0" max="10" step="0.1" value={humanScores[c]} onChange={(e) => updateHuman(c, e.target.value)} />
              </div>
            ))}
          </div>
          <label className="field-label">Human Remarks</label>
          <textarea className="judge-textarea" value={humanRemark} onChange={(e) => setHumanRemark(e.target.value)} />
        </section>

        <section className="judge-section-box judge-score-box">
          <h4>Final Score</h4>
          <p><b>AI Score:</b> {aiTotal}/10</p>
          <p><b>Human Score:</b> {humanTotal}/10</p>
          <p><b>Final Score:</b> {finalScore}/10</p>
        </section>

        <div className="judge-actions-row workspace-footer-actions">
          <button className="action-btn action-view" onClick={() => navigate("/evaluator")}>Back to Dashboard</button>
          <button className="action-btn action-judge" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Evaluation"}
          </button>
        </div>
        {successMessage && <p className="workspace-complete-note">{successMessage}</p>}
      </div>
    </div>
  );
}

export default Evaluate;
