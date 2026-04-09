import { useLocation } from "react-router-dom";
import { useState } from "react";
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
      problemId: app.problemId,
      teamName: app.team.teamName,
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
      const response = await fetch("http://localhost:5000/ai-evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          abstract: app.solution,
        }),
      });

      const data = await response.json();

      setAiFeedback(data.feedback);
      setScore(data.score);
    } catch (err) {
      alert("AI service not running");
    }
  };

  return (
    <div className="eval-page">

      <div className="eval-card">

        <h2>Evaluate Application</h2>

        <div className="info-box">
          <p><b>Team:</b> {app.team.teamName}</p>
          <p><b>Problem ID:</b> {app.problemId}</p>
        </div>

        <div className="abstract-box">
          <h4>Abstract</h4>
          <p>{app.solution}</p>
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