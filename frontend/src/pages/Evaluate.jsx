import { useLocation } from "react-router-dom";
import { useState } from "react";
import { callGemini } from "../utils/gemini";
import "./evaluate.css";

function Evaluate() {
  const { state } = useLocation();
  const app = state?.app;

  const [score, setScore] = useState("");
  const [remarks, setRemarks] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");

  if (!app) return <p>No data found</p>;

  const submitEvaluation = () => {
    const evaluations =
      JSON.parse(localStorage.getItem("evaluations")) || [];

    const newEval = {
      applicationId: app.applicationId || app.id,
      problemId: app.problem?.problemId || app.problem?.id,
      teamName: app.team?.teamName,
      score,
      remarks,
      aiFeedback,
      date: new Date().toLocaleString(),
    };

    evaluations.push(newEval);
    localStorage.setItem("evaluations", JSON.stringify(evaluations));

    alert("Evaluation Submitted");
  };

  // 🔥 AI ASSIST BUTTON
  const generateAI = async () => {
    try {
      const systemPrompt = `You are an expert hackathon evaluator. Respond only with valid JSON and no markdown. The JSON must include keys "score" and "feedback". Score must be a number from 0 to 100.`;
      const userMessage = `Team: ${app.team?.teamName || "Unknown"}\nProblem: ${app.problem?.problemTitle || app.problem?.title || "Unknown"}\nAbstract: ${app.abstractText || ""}`;
      const raw = await callGemini(systemPrompt, userMessage);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setAiFeedback(parsed.feedback || "");
      setScore(parsed.score ?? "");
    } catch (err) {
      const abstractLength = (app.abstractText || "").trim().split(/\s+/).filter(Boolean).length;
      const fallbackScore = Math.max(35, Math.min(95, Math.round((abstractLength / 40) * 100)));
      setScore(fallbackScore);
      setAiFeedback(
        "AI service unavailable. Generated a local fallback score based on abstract length and presence of content."
      );
      console.error(err);
    }
  };

  return (
    <div className="eval-page">

      <div className="eval-card">

        <h2>Evaluate Application</h2>

        <div className="info-box">
          <p><b>Team:</b> {app.team?.teamName || "N/A"}</p>
          <p><b>Problem ID:</b> {app.problem?.problemId || app.problem?.id || "N/A"}</p>
        </div>

        <div className="abstract-box">
          <h4>Abstract</h4>
          <p>{app.abstractText || "N/A"}</p>
        </div>

        {/* AI BUTTON */}
        <button className="ai-btn" onClick={generateAI}>
          🤖 Generate AI Evaluation
        </button>

        {/* SCORE */}
        <input
          className="input"
          placeholder="Enter Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        {/* REMARKS */}
        <textarea
          className="textarea"
          placeholder="Enter Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {/* AI FEEDBACK */}
        {aiFeedback && (
          <div className="ai-box">
            <h4>AI Feedback</h4>
            <p>{aiFeedback}</p>
          </div>
        )}

        <button className="submit-btn" onClick={submitEvaluation}>
          Submit Evaluation
        </button>

      </div>

    </div>
  );
}

export default Evaluate;